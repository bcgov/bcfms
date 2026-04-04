from django.db import migrations


def replace_bclocaltileserver(apps, schema_editor):
    """Replace /bclocaltileserver/ with /bctileserver/ in map_sources.source tiles arrays."""
    with schema_editor.connection.cursor() as cursor:
        cursor.execute(
            """
            UPDATE map_sources
            SET source = jsonb_set(
                source,
                '{tiles}',
                (
                    SELECT jsonb_agg(
                        to_jsonb(replace(tile #>> '{}', '/bclocaltileserver/', '/bctileserver/'))
                    )
                    FROM jsonb_array_elements(source->'tiles') AS tile
                )
            )
            WHERE source::text LIKE '%/bclocaltileserver/%';
            """
        )


def restore_bclocaltileserver(apps, schema_editor):
    """Reverse: replace /bctileserver/ with /bclocaltileserver/ in map_sources.source tiles arrays."""
    with schema_editor.connection.cursor() as cursor:
        cursor.execute(
            """
            UPDATE map_sources
            SET source = jsonb_set(
                source,
                '{tiles}',
                (
                    SELECT jsonb_agg(
                        to_jsonb(replace(tile #>> '{}', '/bctileserver/', '/bclocaltileserver/'))
                    )
                    FROM jsonb_array_elements(source->'tiles') AS tile
                )
            )
            WHERE source::text LIKE '%source=local%';
            """
        )


class Migration(migrations.Migration):

    dependencies = [("bcfms", "0138_remove_sample_widget")]

    operations = [
        migrations.RunPython(replace_bclocaltileserver, restore_bclocaltileserver),
    ]
