from django.db import migrations
import os
from .util.migration_util import format_files_into_sql


class Migration(migrations.Migration):
    dependencies = [("bcfms", "976_4_update_databc_views")]

    sql_dir = os.path.join(os.path.dirname(__file__), "sql")

    update_get_map_attribute_data = format_files_into_sql(
        ["2025-05-27_get_map_attribute_data.sql"],
        os.path.join(sql_dir, "2025"),
    )

    revert_get_map_attribute_data = format_files_into_sql(
        ["2024-12-02_get_map_attribute_data.sql"],
        sql_dir,
    )

    operations = [
        migrations.RunSQL(
            update_get_map_attribute_data,
            revert_get_map_attribute_data,
        )
    ]
