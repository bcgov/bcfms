from django.db import migrations
from arches.app.models import models


def make_photos_1_n(apps, schema_editor):
    source_graph = models.Graph.objects.get(
        slug="project_assessment", source_identifier__isnull=True
    )
    draft_graph = source_graph.draft.first()
    print(f"Got draft {draft_graph}")
    if not draft_graph:
        print(f"no draft, creating one")
        draft_graph = source_graph.create_draft_graph()
    node_to_update = models.Node.objects.get(
        graph=draft_graph,
        alias="submission_photographs",
        is_immutable=False,
    )

    node_to_update.nodegroup.cardinality = "n"
    node_to_update.nodegroup.save()
    source_graph.promote_draft_graph_to_active_graph()
    source_graph.publish(notes="140 - Fixed nodegroup cardinality to make 1:n.")

    # Move all resources to updated IPA graph
    target_graph = models.Graph.objects.get(
        slug="project_assessment", source_identifier__isnull=True
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


def revert_photos_1_n(apps, schema_editor):
    current_graph = models.Graph.objects.get(
        slug="project_assessment", source_identifier__isnull=True
    )
    if (
        current_graph.publication.notes
        == "140 - Fixed nodegroup cardinality to make 1:n."
    ):
        print(f"Setting {current_graph} to be the latest version")
        published_graphs = models.GraphXPublishedGraph.objects.filter(
            graph=current_graph
        ).order_by("-published_time")
        print(f"Found {published_graphs.count()} published graphs")
        if (
            published_graphs[0].notes
            == "140 - Fixed nodegroup cardinality to make 1:n."
        ):
            print(f"Generated graph is the latest version")
            print(f"{published_graphs[1].graph.is_active}")
            print(f"{published_graphs[1].notes}")
            published = models.PublishedGraph.objects.get(
                publication_id=published_graphs[1].publicationid
            )
            serialized_graph = published.serialized_graph
            graph = models.Graph.objects.get(graphid=published_graphs[1].graph.graphid)
            graph.restore_state_from_serialized_graph(serialized_graph=serialized_graph)

            target_graph = models.Graph.objects.get(
                slug="project_assessment", source_identifier__isnull=True
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
                notes="140 - Fixed nodegroup cardinality to make 1:n."
            )
            if published_graph:
                print(f"Deleting {published_graph}")
                published_graph.delete()


class Migration(migrations.Migration):

    dependencies = [
        ("bcfms", "0155_fix_contributor_search_vals"),
    ]

    operations = [migrations.RunPython(make_photos_1_n, revert_photos_1_n)]
