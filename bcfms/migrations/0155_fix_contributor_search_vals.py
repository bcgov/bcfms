import json
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

from django.db import migrations

GRAPH_SLUG = "project_assessment"


def _update_search_string(search_string, node_id, val_transform):
    parsed = urlparse(search_string)
    params = parse_qs(parsed.query, keep_blank_values=True)

    if "advanced-search" not in params:
        return search_string

    advanced_search = json.loads(params["advanced-search"][0])
    for item in advanced_search:
        if node_id in item:
            item[node_id]["val"] = val_transform(item[node_id].get("val"))

    params["advanced-search"] = [json.dumps(advanced_search, separators=(",", ":"))]
    new_query = urlencode(params, doseq=True)
    return urlunparse(parsed._replace(query=new_query))


def _update_node_search_string(apps, alias, node_id, val_transform):
    Node = apps.get_model("models", "Node")
    try:
        node = Node.objects.get(alias=alias, graph__slug=GRAPH_SLUG)
    except Node.DoesNotExist:
        return

    config = node.config or {}
    search_string = config.get("searchString", "")
    if search_string:
        config["searchString"] = _update_search_string(
            search_string, node_id, val_transform
        )
        node.config = config
        node.save()


def forwards(apps, schema_editor):
    # fmo_actor: wrap resource ID val string into a list
    _update_node_search_string(
        apps,
        alias="fmo_actor",
        node_id="009ba8da-faf6-11ed-ac37-5254004d77d3",
        val_transform=lambda val: [val] if isinstance(val, str) else val,
    )
    # paleo_company: change val from "f" to "null"
    _update_node_search_string(
        apps,
        alias="paleo_company",
        node_id="99643f1e-9e4e-11ed-b6d5-5254004d77d3",
        val_transform=lambda val: "null" if val == "f" else val,
    )


def backwards(apps, schema_editor):
    # fmo_actor: unwrap single-element list back to string
    _update_node_search_string(
        apps,
        alias="fmo_actor",
        node_id="009ba8da-faf6-11ed-ac37-5254004d77d3",
        val_transform=lambda val: (
            val[0] if isinstance(val, list) and len(val) == 1 else val
        ),
    )
    # paleo_company: revert "null" back to "f"
    _update_node_search_string(
        apps,
        alias="paleo_company",
        node_id="99643f1e-9e4e-11ed-b6d5-5254004d77d3",
        val_transform=lambda val: "f" if val == "null" else val,
    )


class Migration(migrations.Migration):
    dependencies = [("bcfms", "0151_update_tileserver_urls")]

    operations = [migrations.RunPython(forwards, backwards)]
