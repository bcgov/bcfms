from django.db import migrations
import os
from .util.migration_util import format_files_into_sql
from bcgov_arches_common.migrations.operations.privileged_sql import RunPrivilegedSQL


class Migration(migrations.Migration):
    dependencies = [("bcfms", "976_3_update_fossil_collection_event_vw")]

    sql_dir = os.path.join(os.path.dirname(__file__), "sql")

    create_collection_events_vw = format_files_into_sql(
        ["2025-04-16_databc.collection_events_vw.sql"],
        os.path.join(sql_dir, "2025"),
    )

    revert_collection_events_vw = (
        "drop view databc.collection_events_vw;"
        + "\n"
        + format_files_into_sql(["2024-08-15_databc.collection_events_vw.sql"], sql_dir)
    )

    create_provincially_protected_fossil_sites_vw = format_files_into_sql(
        ["2025-04-16_databc.provincially_protected_fossil_sites_vw.sql"],
        os.path.join(sql_dir, "2025"),
    )

    revert_provincially_protected_fossil_sites_vw = (
        "drop view databc.provincially_protected_fossil_sites_vw;"
        + "\n"
        + format_files_into_sql(
            ["2024-08-15_databc.provincially_protected_fossil_sites_vw.sql"],
            sql_dir,
        )
    )

    refresh_materialized_views = "begin; call refresh_export_mvs(); commit;"
    grant_materialized_views = format_files_into_sql(
        ["2024-08-15_databc_grants.sql"],
        sql_dir,
    )

    operations = [
        migrations.RunSQL(migrations.RunSQL.noop, grant_materialized_views),
        migrations.RunSQL(create_collection_events_vw, revert_collection_events_vw),
        migrations.RunSQL(
            create_provincially_protected_fossil_sites_vw,
            revert_provincially_protected_fossil_sites_vw,
        ),
        migrations.RunSQL(refresh_materialized_views, migrations.RunSQL.noop),
        migrations.RunSQL(grant_materialized_views, migrations.RunSQL.noop),
    ]
