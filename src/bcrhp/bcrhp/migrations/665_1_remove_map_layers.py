# Generated by Django 4.2.13 on 2024-06-18 10:11

from django.core.management import call_command
from django.db import migrations
from django.db.migrations.operations.special import RunPython

from bcrhp.settings import APP_ROOT

mapbox_overlays_dir = f"{APP_ROOT}/pkg/map_layers/mapbox_spec_json/overlays"


def forward(apps, schema_editor):
    call_command(
        "packages",
        operation="delete_mapbox_layer",
        layer_name="Natural Resource Regions",
    )
    call_command("packages", operation="delete_mapbox_layer", layer_name="NTS 1:250k")
    call_command("packages", operation="delete_mapbox_layer", layer_name="NTS 1:50k")
    call_command(
        "packages", operation="delete_mapbox_layer", layer_name="Provinces and States"
    )
    call_command(
        "packages", operation="delete_mapbox_layer", layer_name="TRIM Contours"
    )


def backward(apps, schema_editor):
    call_command(
        "packages",
        operation="add_mapbox_layer",
        layer_name="Natural Resource Regions",
        mapbox_json_path=f"{mapbox_overlays_dir}/national-resource-regions/national-resource-regions.json",
    )
    call_command(
        "packages",
        operation="add_mapbox_layer",
        layer_name="NTS 1:250k",
        mapbox_json_path=f"{mapbox_overlays_dir}/nts250k/nts250k.json",
    )
    call_command(
        "packages",
        operation="add_mapbox_layer",
        layer_name="NTS 1:50k",
        mapbox_json_path=f"{mapbox_overlays_dir}/nts50k/nts50k.json",
    )
    call_command(
        "packages",
        operation="add_mapbox_layer",
        layer_name="Provinces and States",
        mapbox_json_path=f"{mapbox_overlays_dir}/provinces-states/provinces-states.json",
    )
    call_command(
        "packages",
        operation="add_mapbox_layer",
        layer_name="TRIM Contours",
        mapbox_json_path=f"{mapbox_overlays_dir}/trim-contours/trim-contours.json",
    )


class Migration(migrations.Migration):

    dependencies = [
        ("bcrhp", "947_historic_site_one_line"),
    ]

    operations = [RunPython(forward, backward)]
