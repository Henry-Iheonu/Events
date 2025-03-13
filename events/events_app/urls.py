from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    EventListCreateView,
    EventDetailView,
    MyCreatedEventsView,
    LoginView,
    RegisterView,
    RegisterForEventView,
    ListRegistrationsForEventView,
    EventRegistrationCountView,
    ProfileDetailView
)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    # New endpoint for event creators to see full details about their created events:
    path('my-events/', MyCreatedEventsView.as_view(), name='my-created-events'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('events/<int:event_id>/register/', RegisterForEventView.as_view(), name='register-for-event'),
    path('events/<int:event_id>/registrations/', ListRegistrationsForEventView.as_view(), name='list-registrations'),
    path('events/<int:event_id>/registration_count/', EventRegistrationCountView.as_view(), name='registration-count'),
    path('profile/', ProfileDetailView.as_view(), name='profile-detail'),
]
