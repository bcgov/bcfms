drop view if exists databc.collection_events_vw;
create or replace view databc.collection_events_vw as
select row_uuid,
       collection_event_id,
       location_descriptor,
       collection_start_year::int collection_start_year,
       geological_groups geological_group,
       geological_formations geological_formation,
       geological_members geological_member,
       time_scale,
       minimum_time,
       maximum_time,
       size_categories,
       common_names,
       scientific_names,
       publication_types,
       authors,
       publication_count::int,
       publication_years,
       fossil_abundance,
       round(((collection_location::json)->>1)::numeric, 6) latitude,
       round(((collection_location::json)->>0)::numeric, 6) longitude,
       st_point(((collection_location::json)->>0)::numeric, ((collection_location::json)->>1)::numeric) collection_location
from fossil_collection_event.collection_event_vw;
