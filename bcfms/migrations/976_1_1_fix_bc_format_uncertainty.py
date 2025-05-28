from django.db import migrations
import os
from .util.migration_util import format_files_into_sql
from bcgov_arches_common.migrations.operations.privileged_sql import RunPrivilegedSQL


class Migration(migrations.Migration):
    dependencies = [("bcfms", "976_1_create_html_to_plain_string")]

    sql_dir = os.path.join(os.path.dirname(__file__), "sql")

    update_bc_format_uncertainty = format_files_into_sql(
        ["2025-05-19___bc_format_uncertainty.sql"], os.path.join(sql_dir, "2025")
    )
    revert_bc_format_uncertainty = format_files_into_sql(
        ["2025-01-26___bc_format_uncertainty.sql"], os.path.join(sql_dir, "2025")
    )

    operations = [
        RunPrivilegedSQL(update_bc_format_uncertainty, revert_bc_format_uncertainty),
    ]
