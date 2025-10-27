from django.db import migrations
from arches.app.models.models import CardXNodeXWidget


def ensure_default_string_i18n_value(apps, schema_editor):
    for cnw in CardXNodeXWidget.objects.filter(node__datatype="string").all():
        if (
            not cnw.config.raw_value["defaultValue"]
            or not "en" in cnw.config.raw_value["defaultValue"]
            or not "value" in cnw.config.raw_value["defaultValue"]["en"]
        ):
            cnw.config.raw_value["defaultValue"] = {
                "en": {"value": "", "direction": "ltr"}
            }
            cnw.config.save()


class Migration(migrations.Migration):

    dependencies = [
        ("bcfms", "0010_update_get_map_attribute_data"),
    ]

    operations = [
        migrations.RunPython(
            ensure_default_string_i18n_value,
            migrations.RunPython.noop,
        ),
    ]
