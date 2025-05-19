from django.db import migrations
import os
from .util.migration_util import format_files_into_sql
from bcgov_arches_common.migrations.operations.privileged_sql import RunPrivilegedSQL


class Migration(migrations.Migration):
    dependencies = [("bcfms", "1216_fix_parent_discription_component")]

    sql_dir = os.path.join(os.path.dirname(__file__), "sql")

    create_html_to_plain_string = format_files_into_sql(
        ["2025-04-16_html_to_plain_string.sql"], os.path.join(sql_dir, "2025")
    )

    drop_html_to_plain_string = """
    drop function if exists databc.html_to_plain_string;
    """

    refresh_materialized_views = "begin; call refresh_export_mvs(); commit;"

    operations = [
        migrations.RunSQL(migrations.RunSQL.noop, refresh_materialized_views),
        migrations.RunSQL(create_html_to_plain_string, drop_html_to_plain_string),
    ]
