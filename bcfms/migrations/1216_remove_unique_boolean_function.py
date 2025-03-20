from django.db import migrations
from arches.app.models.graph import Graph
from arches.app.models.models import FunctionXGraph, Function


def remove_sample_unique_boolean_function(apps, schema_editor):
    graph = (
        Graph.objects.filter(slug="fossil_sample").prefetch_related("functions").first()
    )
    function = Function.objects.filter(name="Unique Boolean Value").first()
    uq_functions = FunctionXGraph.objects.filter(graph=graph, function=function).all()
    for del_function in uq_functions:
        del_function.delete()
    graph.update_published_graphs()


class Migration(migrations.Migration):
    dependencies = [
        ("bcfms", "1247_update_existing_research_permit_model"),
    ]

    operations = [
        migrations.RunPython(
            remove_sample_unique_boolean_function, migrations.RunPython.noop
        ),
    ]