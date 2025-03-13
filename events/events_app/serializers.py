from rest_framework import serializers
from .models import Event, EventRegistration, Profile

class EventSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    date = serializers.DateField(format="%Y-%m-%d")
    time = serializers.TimeField(format="%H:%M:%S", required=False, allow_null=True)
    event_type = serializers.CharField(max_length=20, required=True)
    organizer = serializers.CharField(max_length=255, required=True)
    location = serializers.CharField(max_length=255, required=True)
    capacity = serializers.IntegerField(required=True)
    event_code = serializers.CharField(max_length=20, read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'user', 'title', 'description', 'date', 'time', 'event_type', 'organizer', 'location', 'capacity', 'event_code']


class CreatedEventSerializer(EventSerializer):
    registration_count = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()

    class Meta(EventSerializer.Meta):
        fields = EventSerializer.Meta.fields + ['registration_count', 'progress_percentage']

    def get_registration_count(self, obj):
        from .models import EventRegistration
        return EventRegistration.objects.filter(event=obj).count()

    def get_progress_percentage(self, obj):
        count = self.get_registration_count(obj)
        if obj.capacity:
            return round((count / obj.capacity) * 100, 2)
        return 0


class EventRegistrationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())
    full_name = serializers.CharField(max_length=255, required=True)
    email = serializers.EmailField(required=True)
    phone_number = serializers.CharField(max_length=15, required=True)
    preferred_contact_method = serializers.ChoiceField(choices=[('Email', 'Email'), ('Phone', 'Phone')], required=True)
    city = serializers.CharField(max_length=100, required=True)
    event_attendance_mode = serializers.ChoiceField(choices=[('In-Person', 'In-Person'), ('Virtual', 'Virtual')], required=True)
    emergency_contact = serializers.CharField(max_length=255, required=True)

    class Meta:
        model = EventRegistration
        fields = ['id', 'user', 'event', 'full_name', 'email', 'phone_number', 'preferred_contact_method', 'city', 'event_attendance_mode', 'emergency_contact', 'registered_at']

    def validate(self, attrs):
        user = self.context['request'].user
        event = attrs['event']
        if EventRegistration.objects.filter(user=user, event=event).exists():
            raise serializers.ValidationError("You are already registered for this event.")
        registered_users = EventRegistration.objects.filter(event=event).count()
        if registered_users >= event.capacity:
            raise serializers.ValidationError("Event capacity reached.")
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    # Use the explicit related name (created_events) on the User model
    created_events = EventSerializer(many=True, read_only=True, source='user.created_events')
    registered_events = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'username', 'email', 'full_name', 'profile_picture',
            'phone_number', 'bio', 'location', 'interests',
            'created_events', 'registered_events'
        ]

    def get_registered_events(self, obj):
        registrations = EventRegistration.objects.filter(user=obj.user)
        events = [registration.event for registration in registrations]
        return EventSerializer(events, many=True).data
