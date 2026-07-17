from django.db import migrations
from arches.app.models import models

update_notes = "203 - Make samples collected mandatory"
correct_company_search_string = '/bc-fossil-management/search?advanced-search=[{"op"%3A"and"%2C"c4eca2de-9dea-11ed-9a7b-5254004d77d3"%3A{"op"%3A"eq"%2C"val"%3A"a7a00d7b-ac19-4b7a-b911-55b4fb1473ff"}%2C"e2f1c29a-c500-11ed-9089-5254004d77d3"%3A{"op"%3A"eq"%2C"val"%3A"3489e41e-0168-4a8f-80f1-75fde26e2130"}%2C"c4ec9b2c-9dea-11ed-9a7b-5254004d77d3"%3A{"op"%3A"~"%2C"lang"%3A"en"%2C"val"%3A""}%2C"c4eca13a-9dea-11ed-9a7b-5254004d77d3"%3A{"op"%3A"~"%2C"lang"%3A"en"%2C"val"%3A""}%2C"a5b2cd72-c4f4-11ed-a06d-5254004d77d3"%3A{"op"%3A"~"%2C"lang"%3A"en"%2C"val"%3A""}%2C"b5ed0072-c4f4-11ed-94de-5254004d77d3"%3A{"op"%3A"~"%2C"lang"%3A"en"%2C"val"%3A""}%2C"009ba8da-faf6-11ed-ac37-5254004d77d3"%3A{"op"%3A""%2C"val"%3A""}%2C"99643f1e-9e4e-11ed-b6d5-5254004d77d3"%3A{"val"%3A"null"}}]&sort-results=asc&sort-by=resource_name&sort-order=asc'
graph_slug = "collection_event"
node_alias = "samples_collected"


def fix_sample_required(apps, schema_editor):
    source_graph = models.Graph.objects.get(
        slug=graph_slug, source_identifier__isnull=True
    )
    draft_graph = source_graph.draft.first()
    if not draft_graph:
        print(f"no draft, creating one")
        draft_graph = source_graph.create_draft_graph()

    node_to_update = models.Node.objects.get(
        graph=draft_graph,
        alias=node_alias,
        is_immutable=False,
    )
    node_to_update.isrequired = True
    node_to_update.save()

    source_graph.promote_draft_graph_to_active_graph()
    source_graph.publish(notes=update_notes)

    # Move all resources to updated collection event graph
    target_graph = models.Graph.objects.get(
        slug=graph_slug, source_identifier__isnull=True
    )
    instances = models.ResourceInstance.objects.filter(graph=target_graph).exclude(
        graph_publication_id=target_graph.publication_id
    )
    print(f"Updating {instances.count()} instances")
    (
        models.ResourceInstance.objects.filter(graph=target_graph)
        .exclude(graph_publication_id=target_graph.publication_id)
        .update(graph_publication_id=target_graph.publication_id)
    )
    print("Instances updated.")


def revert_sample_required(apps, schema_editor):
    current_graph = models.Graph.objects.get(
        slug=graph_slug, source_identifier__isnull=True
    )
    if current_graph.publication.notes == update_notes:
        published_graphs = models.GraphXPublishedGraph.objects.filter(
            graph=current_graph
        ).order_by("-published_time")
        if published_graphs[0].notes == update_notes:
            published = models.PublishedGraph.objects.get(
                publication_id=published_graphs[1].publicationid
            )
            serialized_graph = published.serialized_graph
            graph = models.Graph.objects.get(graphid=published_graphs[1].graph.graphid)
            graph.restore_state_from_serialized_graph(serialized_graph=serialized_graph)

            target_graph = models.Graph.objects.get(
                slug=graph_slug, source_identifier__isnull=True
            )
            instances = models.ResourceInstance.objects.filter(
                graph=target_graph
            ).exclude(graph_publication_id=target_graph.publication_id)
            print(f"Updating {instances.count()} instances")
            models.ResourceInstance.objects.filter(graph=target_graph).exclude(
                graph_publication_id=target_graph.publication_id
            ).update(graph_publication_id=target_graph.publication_id)
            print("Instances updated.")
            published_graph = models.GraphXPublishedGraph.objects.get(
                notes=update_notes
            )
            if published_graph:
                print(f"Deleting {published_graph}")
                published_graph.delete()


class Migration(migrations.Migration):

    dependencies = [
        ("bcfms", "0202_fix_paleo_search_string"),
    ]

    operations = [
        migrations.RunPython(fix_sample_required, revert_sample_required),
    ]
