from django.db import migrations
import os
from .util.migration_util import format_files_into_sql
from bcgov_arches_common.migrations.operations.privileged_sql import RunPrivilegedSQL


class Migration(migrations.Migration):
    dependencies = [("bcfms", "976_1_1_fix_bc_format_uncertainty")]

    sql_dir = os.path.join(os.path.dirname(__file__), "sql")

    drop_dependant_views = """
       drop view fossil_collection_event.collection_event_csv_export_vw;
       drop view databc.collection_events_vw;
       drop view fossil_collection_event.collection_event_vw;
       """

    recreate_dependent_views = format_files_into_sql(
        [
            "2024-07-25_fossil_collection_event.collection_event_vw.sql",
            "2024-08-15_databc.collection_events_vw.sql",
            "2024-07-25_fossil_collection_event.collection_event_csv_export_vw.sql",
        ],
        os.path.join(sql_dir),
    )

    create_fossil_sample_ce_sample_summary_mv = (
        drop_dependant_views
        + "\n"
        + format_files_into_sql(
            ["2025-04-16_fossil_sample.ce_sample_summary_mv.sql"],
            os.path.join(sql_dir, "2025"),
        )
        + "\n"
        + recreate_dependent_views
    )

    revert_fossil_sample_ce_sample_summary_mv = (
        drop_dependant_views
        + "\n"
        + "drop materialized view fossil_sample.ce_sample_summary_mv;"
        + "\n"
        + format_files_into_sql(
            ["2024-07-25_fossil_sample.ce_sample_summary_mv.sql"], sql_dir
        )
        + "\n"
        + recreate_dependent_views
    )

    operations = [
        migrations.RunSQL(
            create_fossil_sample_ce_sample_summary_mv,
            revert_fossil_sample_ce_sample_summary_mv,
        )
    ]
