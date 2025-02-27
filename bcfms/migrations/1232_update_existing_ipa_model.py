from django.db import migrations
from django.core.management import call_command
from arches.app.models.graph import Graph

def replace_ipa_graph(apps, schema_editor):
    graph = Graph.objects.filter(slug="project_assessment").first()
    if graph:
        call_command(
            "resources",
            operation="remove_resources",
            graph=graph.graphid,
            yes=True,
        )

        # Make sure we remove the old indexed objects as we're changing
        # some datatypes
        call_command(
            "es",
            operation="index_resources_by_type",
            resource_types=[graph.graphid],
            clear_index=True,
            quiet=True
        )

        graph.delete()
    call_command(
        "packages",
        operation="import_graphs",
        source="bcfms/pkg/graphs/resource_models/Industry Project Assessment.json"
    )

class Migration(migrations.Migration):
    dependencies = [
        ("bcfms", "1232_add_repository_agreement_value"),
    ]

    operations = [
        migrations.RunPython(replace_ipa_graph, migrations.RunPython.noop),
    ]