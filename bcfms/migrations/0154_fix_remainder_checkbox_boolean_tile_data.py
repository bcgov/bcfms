from django.db import migrations
from arches.app.models import models

from django.core.management import call_command

update_notes = "154 - Fix remainder of checkbox-boolean-widget default values"
# graph_slug = "contributor"
# node_alias = "inactive"


def get_nodes_to_update():
    # Returns an array of tuples of the form (graph, [nodes])
    widget_to_fix = models.Widget.objects.get(name="checkbox-boolean-widget")
    nodes = (
        models.Node.objects.filter(cardxnodexwidget__widget=widget_to_fix)
        .exclude(graph__slug="contributor")
        .filter(graph__source_identifier__isnull=True)
        .prefetch_related("graph")
        .order_by("graph__slug", "alias")
        .all()
    )
    # for node in nodes:
    #     print(node.graph.slug, node.alias)
    result = {}
    for node in nodes:
        result.setdefault(node.graph, []).append(node)
    result = list(result.items())
    return result


def reindex_contributors(apps, schema_editor):
    for graph, nodes in get_nodes_to_update():
        call_command(
            "es",
            operation="index_resources_by_type",
            resource_types=[graph.graphid],
            clear_index=True,
            quiet=True,
        )


def fix_default_value(apps, schema_editor):
    for graph_model, nodes in get_nodes_to_update():
        print(f"Processing {graph_model.slug}")
        source_graph = models.Graph.objects.get(pk=graph_model.graphid)

        draft_graph = source_graph.draft.first()
        # print(f"Got draft {draft_graph}")
        if not draft_graph:
            print(f"\tno draft, creating one")
            draft_graph = source_graph.create_draft_graph()
        for node_to_update in nodes:
            cnw_to_update = models.CardXNodeXWidget.objects.get(node=node_to_update)
            print(f"\tConfig: {cnw_to_update.config}")
            cnw_to_update.config["defaultValue"] = False
            cnw_to_update.save()
        source_graph.promote_draft_graph_to_active_graph()
        source_graph.publish(notes=update_notes)

        # Move all resources to updated graph
        target_graph = models.Graph.objects.get(
            slug=source_graph.slug, source_identifier__isnull=True
        )
        instances = models.ResourceInstance.objects.filter(graph=target_graph).exclude(
            graph_publication_id=target_graph.publication_id
        )
        print(f"\tUpdating {instances.count()} instances")
        (
            models.ResourceInstance.objects.filter(graph=target_graph)
            .exclude(graph_publication_id=target_graph.publication_id)
            .update(graph_publication_id=target_graph.publication_id)
        )
        print("\tInstances updated.\n")


def revert_default_value(apps, schema_editor):
    for current_graph_model, nodes in get_nodes_to_update():
        current_graph = models.Graph.objects.get(pk=current_graph_model.graphid)
        if current_graph.publication.notes == update_notes:
            print(f"Setting {current_graph} to be the latest version")
            published_graphs = models.GraphXPublishedGraph.objects.filter(
                graph=current_graph
            ).order_by("-published_time")
            print(f"\tTotal of {published_graphs.count()} published graphs")
            if published_graphs[0].notes == update_notes:
                print(
                    f"\tGenerated graph is the latest version - trying to revert to previous version..."
                )
                print(
                    f"\tReverting to publication with notes: {published_graphs[1].notes}. Is active?{published_graphs[1].graph.is_active}"
                )
                published = models.PublishedGraph.objects.get(
                    publication_id=published_graphs[1].publicationid
                )
                serialized_graph = published.serialized_graph
                graph = models.Graph.objects.get(
                    graphid=published_graphs[1].graph.graphid
                )
                graph.restore_state_from_serialized_graph(
                    serialized_graph=serialized_graph
                )

                target_graph = models.Graph.objects.get(
                    slug=current_graph.slug, source_identifier__isnull=True
                )
                instances = models.ResourceInstance.objects.filter(
                    graph=target_graph
                ).exclude(graph_publication_id=target_graph.publication_id)
                print(f"\tUpdating {instances.count()} instances")
                models.ResourceInstance.objects.filter(graph=target_graph).exclude(
                    graph_publication_id=target_graph.publication_id
                ).update(graph_publication_id=target_graph.publication_id)
                print(f"\t{current_graph.slug} Instances updated.")
                published_graph = models.GraphXPublishedGraph.objects.get(
                    graph__slug=current_graph.slug, notes=update_notes
                )
                if published_graph:
                    print(f"\tDeleting {published_graph}")
                    # published_graph.delete()


# Tiles with a null value for checkbox-boolean-widget nodes were created before
# the widget enforced false as the default. Update all such tiles so the value
# is false (JSON false) rather than null / missing.

# Before updating, snapshot the affected rows so the reverse migration can
# restore the original tiledata exactly.
backup_sql = """
CREATE TABLE bcfms_checkbox_boolean_tile_backup_154 AS
SELECT DISTINCT ON (t.tileid) t.tileid, t.tiledata
FROM tiles t
JOIN (select * from nodes n2 join graphs g2 on n2.graphid = g2.graphid where g2.slug != 'contributor') n ON t.nodegroupid = n.nodegroupid
JOIN (
    SELECT DISTINCT nodeid
    FROM cards_x_nodes_x_widgets
    WHERE widgetid = (select widgetid from widgets where name = 'checkbox-boolean-widget')
) an ON an.nodeid = n.nodeid
WHERE t.tiledata->>(an.nodeid::text) IS NULL;
"""

fix_tile_data_sql = """
WITH updates AS (
    SELECT
        t.tileid,
        jsonb_object_agg(an.nodeid::text, 'false'::jsonb) AS patch
    FROM tiles t
    JOIN (select * from nodes n2 join graphs g2 on n2.graphid = g2.graphid where g2.slug != 'contributor') n ON t.nodegroupid = n.nodegroupid
    JOIN (
        SELECT DISTINCT nodeid
        FROM cards_x_nodes_x_widgets
        WHERE widgetid = (select widgetid from widgets where name = 'checkbox-boolean-widget')
    ) an ON an.nodeid = n.nodeid
    WHERE t.tiledata->>(an.nodeid::text) IS NULL
    GROUP BY t.tileid
)
UPDATE tiles t
SET tiledata = t.tiledata || updates.patch
FROM updates
WHERE t.tileid = updates.tileid;
"""

revert_tile_data_sql = """
UPDATE tiles t
SET tiledata = b.tiledata
FROM bcfms_checkbox_boolean_tile_backup_154 b
WHERE t.tileid = b.tileid;
"""

drop_backup_sql = """
DROP TABLE bcfms_checkbox_boolean_tile_backup_154;
"""


class Migration(migrations.Migration):
    dependencies = [
        ("bcfms", "0215_collection_event_map_styling"),
    ]

    operations = [
        # The reindex will take too long to run as part of the migration. Release will need a full reindex afterwards
        # migrations.RunPython(migrations.RunPython.noop, reindex_contributors),
        migrations.RunPython(fix_default_value, revert_default_value),
        migrations.RunSQL(
            sql=[backup_sql, fix_tile_data_sql],
            reverse_sql=[revert_tile_data_sql, drop_backup_sql],
        ),
        # migrations.RunPython(reindex_contributors, migrations.RunPython.noop),
    ]
