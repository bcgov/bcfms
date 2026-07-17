from django.db import migrations
from arches.app.models import models

from django.core.management import call_command

update_notes = "210 - Fixed inactive default value"
graph_slug = "contributor"
node_alias = "inactive"


def reindex_contributors(apps, schema_editor):
    graph = models.Graph.objects.filter(slug=graph_slug).first()
    if graph:
        call_command(
            "es",
            operation="index_resources_by_type",
            resource_types=[graph.graphid],
            clear_index=True,
            quiet=True,
        )


def fix_default_value(apps, schema_editor):
    source_graph = models.Graph.objects.get(
        slug=graph_slug, source_identifier__isnull=True
    )
    draft_graph = source_graph.draft.first()
    # print(f"Got draft {draft_graph}")
    if not draft_graph:
        print(f"no draft, creating one")
        draft_graph = source_graph.create_draft_graph()
    node_to_update = models.Node.objects.get(
        graph=draft_graph,
        alias=node_alias,
        is_immutable=False,
    )
    cnw_to_update = models.CardXNodeXWidget.objects.get(node=node_to_update)
    print(cnw_to_update.config)
    cnw_to_update.config["defaultValue"] = False
    cnw_to_update.save()
    source_graph.promote_draft_graph_to_active_graph()
    source_graph.publish(notes=update_notes)

    # Move all resources to updated IPA graph
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


def revert_default_value(apps, schema_editor):
    current_graph = models.Graph.objects.get(
        slug=graph_slug, source_identifier__isnull=True
    )
    if current_graph.publication.notes == update_notes:
        print(f"Setting {current_graph} to be the latest version")
        published_graphs = models.GraphXPublishedGraph.objects.filter(
            graph=current_graph
        ).order_by("-published_time")
        print(f"Found {published_graphs.count()} published graphs")
        if published_graphs[0].notes == update_notes:
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


# Tiles with a null value for checkbox-boolean-widget nodes were created before
# the widget enforced false as the default. Update all such tiles so the value
# is false (JSON false) rather than null / missing.

# Before updating, snapshot the affected rows so the reverse migration can
# restore the original tiledata exactly.
backup_sql = """
CREATE TABLE bcfms_checkbox_boolean_tile_backup_210 AS
SELECT DISTINCT ON (t.tileid) t.tileid, t.tiledata
FROM tiles t
JOIN (select * from nodes n2 join graphs g2 on n2.graphid = g2.graphid where g2.slug = 'contributor') n ON t.nodegroupid = n.nodegroupid
JOIN (
    SELECT DISTINCT nodeid
    FROM cards_x_nodes_x_widgets
    WHERE widgetid = '0346bc9c-d235-4313-adc8-d0e210b2ef25'
) an ON an.nodeid = n.nodeid
WHERE t.tiledata->>(an.nodeid::text) IS NULL;
"""

fix_tile_data_sql = """
WITH updates AS (
    SELECT
        t.tileid,
        jsonb_object_agg(an.nodeid::text, 'false'::jsonb) AS patch
    FROM tiles t
    JOIN (select * from nodes n2 join graphs g2 on n2.graphid = g2.graphid where g2.slug = 'contributor') n ON t.nodegroupid = n.nodegroupid
    JOIN (
        SELECT DISTINCT nodeid
        FROM cards_x_nodes_x_widgets
        WHERE widgetid = '0346bc9c-d235-4313-adc8-d0e210b2ef25'
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
FROM bcfms_checkbox_boolean_tile_backup_210 b
WHERE t.tileid = b.tileid;
"""

drop_backup_sql = """
DROP TABLE bcfms_checkbox_boolean_tile_backup_210;
"""


class Migration(migrations.Migration):
    dependencies = [
        ("bcfms", "0203_fix_samples_collected_required"),
    ]

    operations = [
        migrations.RunPython(migrations.RunPython.noop, reindex_contributors),
        migrations.RunPython(fix_default_value, revert_default_value),
        migrations.RunSQL(
            sql=[backup_sql, fix_tile_data_sql],
            reverse_sql=[revert_tile_data_sql, drop_backup_sql],
        ),
        migrations.RunPython(reindex_contributors, migrations.RunPython.noop),
    ]
