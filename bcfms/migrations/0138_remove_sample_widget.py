from django.db import migrations
from arches.app.models.models import Widget


def delete_widget(apps, schema_editor):
    Widget.objects.get(name="sample-widget").delete()


def add_widget(apps, schema_editor):
    widget = Widget()
    widget.name = "sample-widget"
    widget.component = "views/components/widgets/sample-widget"
    widget.datatype = "sample-datatype"
    widget.defaultconfig = {"x_placeholder": "Longitude", "y_placeholder": "Latitude"}
    widget.save()


class Migration(migrations.Migration):

    dependencies = [
        ("bcfms", "0106_fix_cnw_string_configurations"),
    ]

    operations = [migrations.RunPython(delete_widget, add_widget)]
