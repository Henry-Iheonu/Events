from django.contrib.auth.models import User
from django.db import models
import random
import string

def generate_event_code():
    """Generate a unique event code starting with '#'."""
    return '#' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=19))

class Event(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name="created_events"  # Explicit related name for created events
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()
    time = models.TimeField(null=True, blank=True)
    location = models.CharField(max_length=255)
    event_type = models.CharField(max_length=20)  # e.g. Conference, Webinar
    organizer = models.CharField(max_length=255)
    capacity = models.IntegerField()
    event_code = models.CharField(
        max_length=20, 
        unique=True, 
        default=generate_event_code,
        editable=False
    )

    def __str__(self):
        return self.title


class EventRegistration(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    preferred_contact_method = models.CharField(
        max_length=10, 
        choices=[('Email', 'Email'), ('Phone', 'Phone')]
    )
    city = models.CharField(max_length=255)
    event_attendance_mode = models.CharField(
        max_length=10, 
        choices=[('In-Person', 'In-Person'), ('Virtual', 'Virtual')]
    )
    emergency_contact = models.CharField(max_length=20)
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('email', 'event')  # Prevent duplicate registrations for same email

    def __str__(self):
        return f"{self.full_name} registered for {self.event.title}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    interests = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.user.username
