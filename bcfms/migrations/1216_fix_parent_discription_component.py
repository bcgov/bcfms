from django.db import migrations
from arches.app.models.models import Function


def fix_parent_collection_event_component(apps, schema_editor):
    function = Function.objects.filter(name="Parent Collection Event Refresh").first()
    function.component = (
        "views/components/functions/refresh-parent-collection-event-descriptors"
    )
    function.save()


def revert_parent_collection_event_component(apps, schema_editor):
    function = Function.objects.filter(name="Parent Collection Event Refresh").first()
    function.component = "views/components/functions/parent-collection-event-refresh"
    function.save()


class Migration(migrations.Migration):
    dependencies = [
        ("bcfms", "1216_remove_unique_boolean_function"),
    ]

    operations = [
        migrations.RunPython(
            fix_parent_collection_event_component,
            revert_parent_collection_event_component,
        ),
    ]
