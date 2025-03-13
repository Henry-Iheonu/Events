from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
import qrcode
from django.core.mail import EmailMessage
from django.conf import settings
from io import BytesIO

from .models import Event, EventRegistration, Profile
from .serializers import EventSerializer, CreatedEventSerializer, EventRegistrationSerializer, ProfileSerializer

# ---------------------- EVENT VIEWS ---------------------- #

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    # Ensure that the logged-in user is set as the creator
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

# New view: list events created by the logged-in user with full details
class MyCreatedEventsView(generics.ListAPIView):
    serializer_class = CreatedEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(user=self.request.user)

# ---------------------- AUTHENTICATION VIEWS ---------------------- #

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            })
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")
        full_name = request.data.get("full_name")
        phone_number = request.data.get("phone_number")
        bio = request.data.get("bio")
        location = request.data.get("location")
        interests = request.data.get("interests")

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        Profile.objects.create(
            user=user,
            full_name=full_name or "",
            phone_number=phone_number or "",
            bio=bio or "",
            location=location or "",
            interests=interests or ""
        )

        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

# ---------------------- EVENT REGISTRATION VIEWS ---------------------- #

class RegisterForEventView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        user = request.user
        event = Event.objects.filter(id=event_id).first()

        if not event:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        if EventRegistration.objects.filter(event=event).count() >= event.capacity:
            return Response({'error': 'Event is at full capacity'}, status=status.HTTP_400_BAD_REQUEST)

        if EventRegistration.objects.filter(user=user, event=event).exists():
            return Response({'error': 'You are already registered for this event'}, status=status.HTTP_400_BAD_REQUEST)

        registration_data = {
            'event': event.id,
            'full_name': request.data.get('full_name'),
            'email': request.data.get('email'),
            'phone_number': request.data.get('phone_number'),
            'preferred_contact_method': request.data.get('preferred_contact_method'),
            'city': request.data.get('city'),
            'event_attendance_mode': request.data.get('event_attendance_mode'),
            'emergency_contact': request.data.get('emergency_contact'),
        }

        serializer = EventRegistrationSerializer(data=registration_data, context={'request': request})

        if serializer.is_valid():
            registration = serializer.save(user=user)

            qr_data = f"""
Full Name: {registration.full_name}
Email: {registration.email}
Event: {event.title}
Organizer: {event.organizer}
Event Type: {event.event_type}
Location: {event.location}
Event Code: {event.event_code}
Date: {event.date}
Time: {event.time}
Registered At: {registration.registered_at}
            """
            qr_img = qrcode.make(qr_data)
            img_io = BytesIO()
            qr_img.save(img_io, 'PNG')
            img_io.seek(0)

            email_subject = f"Your Registration for {event.title} - QR Code"
            email_body = f"Thank you for registering for {event.title}. Your QR code with event details is attached."
            email = EmailMessage(
                email_subject,
                email_body,
                settings.DEFAULT_FROM_EMAIL,
                [registration.email],
            )
            email.attach('registration_qr_code.png', img_io.read(), 'image/png')
            email.send()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, event_id):
        user = request.user
        event = Event.objects.filter(id=event_id).first()

        if not event:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        registration = EventRegistration.objects.filter(user=user, event=event).first()
        if registration:
            registration.delete()
            return Response({"message": "Successfully unregistered"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Registration not found"}, status=status.HTTP_404_NOT_FOUND)

class ListRegistrationsForEventView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, event_id):
        event = Event.objects.filter(id=event_id).first()

        if not event:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

        registrations = EventRegistration.objects.filter(event=event)
        serializer = EventRegistrationSerializer(registrations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class EventRegistrationCountView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, event_id):
        event = Event.objects.filter(id=event_id).first()
        if not event:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        count = EventRegistration.objects.filter(event=event).count()
        return Response({'registration_count': count}, status=status.HTTP_200_OK)

# ---------------------- PROFILE VIEWS ---------------------- #

class ProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
