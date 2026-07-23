import json

from django.db import migrations
from arches.app.models import models
from arches.app.utils.betterJSONSerializer import JSONSerializer, JSONDeserializer

from django.core.management import call_command

update_notes = "154 - Fix remainder of checkbox-boolean-widget default values"
# graph_slug = "contributor"
# node_alias = "inactive"

STRUCTURAL_FIELDS = frozenset(
    {"nodes", "edges", "nodegroups", "cards", "widgets", "cards_x_nodes_x_widgets"}
)

_FIELD_ID_KEY = {
    "nodes": "nodeid",
    "edges": "edgeid",
    "nodegroups": "nodegroupid",
    "cards": "cardid",
    "widgets": "id",
    "cards_x_nodes_x_widgets": "id",
}

# Keys that restore_state_from_serialized_graph deletes in-place from the
# serialized dict before constructing model objects.  They are present in a
# freshly-serialized live graph but absent (None) in our mutated reference,
# so we exclude them from the structural comparison to avoid false positives.
# See graph.py restore_state_from_serialized_graph for the matching del stmts.
_EXCLUDED_ITEM_KEYS = {
    "nodes": frozenset({"is_collector", "parentproperty"}),
    "cards": frozenset({"is_editable", "constraints"}),
}


def _vals_equal(a, b):
    """
    Recursive structural equality that treats None and [] as equivalent.
    Arches serializes empty constraint/widget lists as null in some versions,
    causing false positives when compared against a live graph that initialises
    those fields as empty lists.
    """
    if a is None:
        a = []
    if b is None:
        b = []
    if isinstance(a, dict) and isinstance(b, dict):
        if set(a.keys()) != set(b.keys()):
            print(
                f"Different set of keys: \n{sorted(set(a.keys()))} : \n{ sorted(set(b.keys()))}"
            )
            return False
        return all(_vals_equal(a[k], b[k]) for k in a)
    if isinstance(a, list) and isinstance(b, list):
        if len(a) != len(b):
            print(f"Different lengths: {a} vs {b} - {len(a) != len(b)}")
            return False
        return all(_vals_equal(x, y) for x, y in zip(a, b))
    is_equal = a == b
    if not is_equal:
        print(f"a: {a}, b: {b}, is_equal: {is_equal}")
    return is_equal


def _item_diff(live_item, ref_item, max_keys=5):
    """Returns a dict of {key: (live_value, ref_value)} for keys that differ."""
    all_keys = set(live_item) | set(ref_item)
    diffs = {
        k: (live_item.get(k), ref_item.get(k))
        for k in all_keys
        if not _vals_equal(live_item.get(k), ref_item.get(k))
    }
    if len(diffs) > max_keys:
        truncated = dict(list(diffs.items())[:max_keys])
        truncated[f"... ({len(diffs) - max_keys} more keys)"] = ("...", "...")
        return truncated
    return diffs


def _describe_difference(field, live_val, ref_val):
    """Returns a human-readable description of what differs between two field values."""
    if isinstance(live_val, list) and isinstance(ref_val, list):
        if len(live_val) != len(ref_val):
            return (
                f"field '{field}': live has {len(live_val)} items, "
                f"reference has {len(ref_val)} items"
            )
        id_key = _FIELD_ID_KEY.get(field, "id")
        live_by_id = {item.get(id_key): item for item in live_val if id_key in item}
        ref_by_id = {item.get(id_key): item for item in ref_val if id_key in item}
        differing_ids = [
            k
            for k in live_by_id
            if not _vals_equal(live_by_id.get(k), ref_by_id.get(k))
        ]
        only_in_live = [k for k in live_by_id if k not in ref_by_id]
        only_in_ref = [k for k in ref_by_id if k not in live_by_id]

        lines = [f"field '{field}': {len(differing_ids)} item(s) with changed content"]
        for item_id in differing_ids[:3]:
            diffs = _item_diff(live_by_id[item_id], ref_by_id.get(item_id, {}))
            diff_lines = [
                f"      {k}: live={lv!r}  ref={rv!r}" for k, (lv, rv) in diffs.items()
            ]
            lines.append(f"    {item_id}:\n" + "\n".join(diff_lines))
        if len(differing_ids) > 3:
            lines.append(f"    ... and {len(differing_ids) - 3} more")
        if only_in_live:
            lines.append(
                f"  {len(only_in_live)} item(s) only in live: {only_in_live[:5]}"
            )
        if only_in_ref:
            lines.append(
                f"  {len(only_in_ref)} item(s) only in reference: {only_in_ref[:5]}"
            )
        return "\n".join(lines)
    return f"field '{field}': live={live_val!r}, reference={ref_val!r}"


def _normalize_field(field, items):
    """
    Strips keys that restore_state_from_serialized_graph deletes in-place from item dicts,
    then sorts the list by the field's ID key for order-insensitive comparison.
    The live serialization and the reference may return items in different orders
    (e.g. DB insertion order vs. serialized order), which would otherwise be a false positive.
    """
    if not isinstance(items, list):
        return items
    excluded = _EXCLUDED_ITEM_KEYS.get(field, frozenset())
    if excluded:
        items = [
            (
                {k: v for k, v in item.items() if k not in excluded}
                if isinstance(item, dict)
                else item
            )
            for item in items
        ]
    id_key = _FIELD_ID_KEY.get(field, "id")
    try:
        return sorted(
            items, key=lambda x: str(x.get(id_key, "")) if isinstance(x, dict) else ""
        )
    except TypeError:
        return items


def graphs_structurally_match(live_graph, reference_serialized):
    """
    Serializes live_graph and compares its structural fields against reference_serialized.
    Returns (True, None) when they match, or (False, detail_message) for the first difference.

    Note: restore_state_from_serialized_graph mutates its argument in-place, converting
    UUID strings to uuid.UUID objects. We normalize the reference through a JSON round-trip
    (using str() as the fallback encoder) so both sides use plain strings for comparison.
    """
    live_serialized = JSONDeserializer().deserialize(
        JSONSerializer().serialize(live_graph, force_recalculation=True)
    )
    normalized_reference = json.loads(json.dumps(reference_serialized, default=str))
    for field in STRUCTURAL_FIELDS:
        live_val = _normalize_field(field, live_serialized.get(field))
        ref_val = _normalize_field(field, normalized_reference.get(field))
        if not _vals_equal(live_val, ref_val):
            return False, _describe_difference(field, live_val, ref_val)
    return True, None


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


def reset_geojson_node_configs(source_graph, draft_graph):
    # There is a bug in arches core that resets the geojson advanced styling every time a draft is created
    geojson_nodes = [
        node
        for node in source_graph.node_set.all()
        if node.datatype == "geojson-feature-collection"
    ]
    for node in geojson_nodes:
        draft_node = next(
            (
                d_node
                for d_node in draft_graph.node_set.all()
                if d_node.alias == node.alias
            ),
            None,
        )
        if draft_node:
            print(f"Resetting geojson node config {draft_node.alias} in draft graph")
            draft_node.config = node.config
            draft_node.save()


def fix_default_value(apps, schema_editor):
    for graph_model, nodes in get_nodes_to_update():
        print(f"Processing {graph_model.slug}")
        source_graph = models.Graph.objects.get(pk=graph_model.graphid)

        if source_graph.has_unpublished_changes:
            raise RuntimeError(
                f"Graph '{source_graph.slug}' already has unpublished changes. "
                "Refusing to proceed to avoid overwriting in-progress work."
            )

        draft_graph = source_graph.draft.first()
        # print(f"Got draft {draft_graph}")
        if not draft_graph:
            print(f"\tno draft, creating one")
            draft_graph = source_graph.create_draft_graph()

        # Fix the GeoJSON nodes - bug in core that causes all advanced styles to be cleared
        reset_geojson_node_configs(source_graph, draft_graph)

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

                live_graph = models.Graph.objects.get(pk=current_graph.graphid)
                match, differing_field = graphs_structurally_match(
                    live_graph, serialized_graph
                )
                if not match:
                    raise RuntimeError(
                        f"Revert of '{current_graph.slug}' (graphid={current_graph.graphid}) "
                        f"to publication '{published_graphs[1].notes}' "
                        f"(publicationid={published_graphs[1].publicationid}) "
                        f"left the graph with unexpected structural differences after restore: "
                        f"{differing_field}. "
                        "Refusing to clear has_unpublished_changes."
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
                    # Pre-clear FK on any graph still pointing at the publication we
                    # are about to delete, preventing the SET_NULL cascade from
                    # setting has_unpublished_changes=True on the active graph.
                    # Pre-clear FK so the SET_NULL cascade on delete() finds nothing.
                    models.GraphModel.objects.filter(
                        publication=published_graph
                    ).update(
                        publication=published_graphs[1],
                    )
                    published_graph.delete()
                    # delete() may trigger signals/cascades that re-set the flag;
                    # force it back to False via a direct queryset update.
                    models.GraphModel.objects.filter(
                        slug=current_graph.slug, source_identifier__isnull=True
                    ).update(has_unpublished_changes=False)


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
