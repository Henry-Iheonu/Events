from django.db import migrations
import random
import string

def generate_event_code():
    """Generate a unique event code starting with '#'."""
    return '#' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=19))

def set_event_codes(apps, schema_editor):
    Event = apps.get_model('events_app', 'Event')
    for event in Event.objects.all():
        if not event.event_code:
            event.event_code = generate_event_code()
            event.save()

class Migration(migrations.Migration):
    dependencies = [
        ('events_app', '0007_event_event_code'),  # The migration that added the event_code field
    ]

    operations = [
        migrations.RunPython(set_event_codes),
    ]
