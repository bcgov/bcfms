from django.db import migrations
import os
from .util.migration_util import format_files_into_sql
from bcgov_arches_common.migrations.operations.privileged_sql import RunPrivilegedSQL


class Migration(migrations.Migration):
    dependencies = [("bcfms", "976_2_update_ce_sample_summary_mv")]

    sql_dir = os.path.join(os.path.dirname(__file__), "sql")

    drop_dependant_views = """
       drop view fossil_collection_event.collection_event_csv_export_vw;
       drop view databc.collection_events_vw;
       """

    recreate_dependent_views = format_files_into_sql(
        [
            "2024-07-25_fossil_collection_event.collection_event_csv_export_vw.sql",
            "2024-08-15_databc.collection_events_vw.sql",
        ],
        os.path.join(sql_dir),
    )

    create_fossil_collection_event_collection_event_vw = (
        drop_dependant_views
        + "\n"
        + format_files_into_sql(
            ["2025-04-16_fossil_collection_event.collection_event_vw.sql"],
            os.path.join(sql_dir, "2025"),
        )
        + "\n"
        + recreate_dependent_views
    )

    revert_fossil_collection_event_collection_event_vw = (
        drop_dependant_views
        + "\n"
        + format_files_into_sql(
            ["2024-07-25_fossil_collection_event.collection_event_vw.sql"],
            sql_dir,
        )
        + "\n"
        + recreate_dependent_views
    )

    operations = [
        migrations.RunSQL(
            create_fossil_collection_event_collection_event_vw,
            revert_fossil_collection_event_collection_event_vw,
        )
    ]
