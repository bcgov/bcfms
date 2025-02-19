# Generated by Django 4.2.13 on 2024-06-14 11:10
"""
BCRHP Release 1.1.0 Note

This migration is not meant to run for a clean database.
The reason being is because the majority of the materialzed views require data
population for other views to be created based on the data entries, layman's
terms 'chicken or egg' problem.

The database must be pre-seeded with all the data population beforehand.

"""
from django.db import migrations
from bcgov_arches_common.migrations.operations.privileged_sql import RunPrivilegedSQL


class Migration(migrations.Migration):

    dependencies = [
        ("bcrhp", "947_create_testing_table"),
    ]

    operations = [
        # The reverse of the databc.V_HISTORIC_ENVIRO_ONEROW_SITE  needs to be done after all the MVs have been created
        RunPrivilegedSQL(
            "",
            """
            create or replace view databc.V_HISTORIC_ENVIRO_ONEROW_SITE as
            select distinct bn.resourceinstanceid site_id,
                            bn.borden_number borden_number,
                            case when br.officially_recognized_site then 'Y' else 'N' end is_officially_recognized,
                            br.registration_status registration_status,
                            cn.name                                 common_name,
                            array_to_string(other_name.names, '; ') other_name,
                            prop.pid         parcel_id,
                            prop.street_address street_address,
                            prop.city,
                            prop.province,
                            prop.locality,
                            databc.html_to_plain_string(prop.location_description),
                            br.authorities->>'government_name' government_name,
                            br.authorities->>'authority' government_level,
                            br.authorities->>'recognition_type' protection_type,
                            to_date(br.authorities->>'start_date', 'YYYY-MM-DD') protection_start_date,
                            br.authorities->>'reference_number' reference_number,
                            case when mc.chronology is null then null else to_char(to_date(chronology[0]->>'start_year', 'YYYY-MM-DD'), 'YYYY')::numeric(4,0) end construction_date,
                            case when mc.chronology is not null and (chronology[0]->>'dates_approximate')::boolean then 'Circa' end construction_date_qualifier,
                            case when significance_statement is null then null else (significance_statement->>'significance_type') end significance_type,
                            case when significance_statement is null then null else (significance_statement->>'physical_description') end physical_description,
                            case when significance_statement is null then null else (significance_statement->>'heritage_value') end heritage_value,
                            case when significance_statement is null then null else (significance_statement->>'defining_elements') end defining_elements,
                            case when significance_statement is null then null else (significance_statement->>'document_location') end document_location,
                            ca.actors->>'Architect / Designer' architect_name,
                            ca.actors->>'Builder' builder_name,
                            hf.functional_states->>'Current' current_function,
                            hf.functional_states->>'Historic' historic_function,
                            msb.area_sqm::numeric(19,2) dimensions_area_sqm,
                            msb.site_centroid_latitude::numeric(10,6) gis_latitude,
                            msb.site_centroid_longitude::numeric(10,6) gis_longitude,
                            msb.utmzone::numeric(2,0) utm_zone,
                            msb.utmnorthing::numeric(10,0) utm_northing,
                            msb.utmeasting::numeric(10,0) utm_easting,
                            'https://apps.nrs.gov.bc.ca/int/bcrhp/report/'||bn.resourceinstanceid site_url,
                            msb.site_boundary
            from mv_borden_number bn
                     left join (select resourceinstanceid, name from mv_site_names where name_type = 'Common') cn on cn.resourceinstanceid = bn.resourceinstanceid
                     left join (select resourceinstanceid, array_agg(name) names from mv_site_names where name_type = 'Other' group by resourceinstanceid) other_name on other_name.resourceinstanceid = bn.resourceinstanceid
                     join (select distinct r.resourceinstanceid,
                                                r.officially_recognized_site,
                                                r.registration_status,
                                                jsonb_agg(
                                                        case when pe.authority is null then null else
                                                            jsonb_build_object(
                                                                    'authority', pe.authority,
                                                                    'auth_order', databc.authority_priority(pe.authority),
                                                                    'start_date', pe.designation_or_protection_start_date,
                                                                    'government_name', pe.government_name,
                                                                    'recognition_type', pe.recognition_type,
                                                                    'reference_number', pe.reference_number
                                                                ) end order by databc.authority_priority(pe.authority) desc,
                                                            designation_or_protection_start_date desc )->0 authorities
                                from mv_bc_right r
                                         left join mv_site_protection_event pe on r.bc_right_id = pe.bc_right_id
                                group by r.resourceinstanceid, r.officially_recognized_site, r.registration_status) br
                               on bn.resourceinstanceid = br.resourceinstanceid
                     join mv_site_record_admin msra on bn.resourceinstanceid = msra.resourceinstanceid
                     left join (select resourceinstanceid, jsonb_agg(
                        jsonb_build_object(
                            'start_year', start_year,
                            'end_year', end_year,
                            'dates_approximate', dates_approximate,
                            'event', event,
                            'source', source,
                            'event_notes', event_notes) order by start_year
                ) chronology from mv_chronology where event = 'Construction' group by resourceinstanceid ) mc on bn.resourceinstanceid = mc.resourceinstanceid
                     left join (select resourceinstanceid,
                                       jsonb_object_agg(state_period, array_to_string(functional_states, '; ') ) functional_states
                                from mv_heritage_function
                                group by resourceinstanceid) hf on bn.resourceinstanceid = hf.resourceinstanceid
                     left join (select resourceinstanceid,
                                       jsonb_object_agg(actor_type, array_to_string(actors, '; ')) actors
                                from mv_construction_actors
                                group by resourceinstanceid) ca on bn.resourceinstanceid = ca.resourceinstanceid
                     left join mv_site_boundary msb on bn.resourceinstanceid = msb.resourceinstanceid
                     left join (select resourceinstanceid,
                                       jsonb_agg(
                                               jsonb_build_object(
                                                       'significance_type', databc.html_to_plain_string(significance_type),
                                                       'significance_level', databc.authority_priority(significance_type),
                                                       'physical_description', databc.html_to_plain_string(physical_description),
                                                       'defining_elements', databc.html_to_plain_string(defining_elements),
                                                       'heritage_value', databc.html_to_plain_string(heritage_value),
                                                       'document_location', databc.html_to_plain_string(document_location)
                                                   )
                                                order by databc.authority_priority(significance_type) desc
                                           )->0 significance_statement
                                from mv_bc_statement_of_significance group by resourceinstanceid) sos on bn.resourceinstanceid = sos.resourceinstanceid,
                databc.get_first_address(bn.resourceinstanceid) prop
            where msra.bcrhp_submission_status in ('Approved - Basic Record','Approved - Full Record')
            and registration_status in ('Federal Jurisdiction', 'Recorded/Unprotected', 'Registered', 'Legacy')
            and not coalesce(msra.restricted, false);
            DO
            $$
                DECLARE
                    databc_user text;
                BEGIN
                    select replace(current_database(), 'bcrhp','proxy_databc') into databc_user;
                    EXECUTE format('grant select on databc.v_historic_enviro_onerow_site to %s' ,quote_ident(databc_user));
                end;
            $$ language 'plpgsql';
            """,
        ),
        RunPrivilegedSQL(
            """
            begin;
            drop index if exists mv_hc_idx;
            drop materialized view if exists mv_heritage_class cascade;
            create materialized view mv_heritage_class as
                select resourceinstanceid,
                    jsonb_agg(
                        jsonb_build_object(
                            'resource_count', contributing_resource_count,
                            'ownership', __arches_get_concept_label(ownership),
                            'category', __arches_get_concept_label(heritage_category)
                        )
                    ) heritage_class
                from heritage_site.heritage_class group by resourceinstanceid;
            create index mv_hc_idx on mv_heritage_class(resourceinstanceid);
            commit;
            """,
            """
            drop index if exists mv_hc_idx;
            drop materialized view if exists mv_heritage_class cascade;
            """,
        ),
        RunPrivilegedSQL(
            """
            begin;
            drop index if exists mv_ht_idx;
            drop materialized view if exists mv_heritage_theme cascade;
            create materialized view mv_heritage_theme as
                select resourceinstanceid,
                       __arches_get_concept_label(unnest(heritage_theme)) heritage_theme
                from heritage_site.heritage_theme group by resourceinstanceid,
                                                              __arches_get_concept_label(unnest(heritage_theme));
            create index mv_ht_idx on mv_heritage_theme(resourceinstanceid);
            commit;
            """,
            """
            drop index if exists mv_ht_idx;
            drop materialized view if exists mv_heritage_theme cascade;
            """,
        ),
        RunPrivilegedSQL(
            """
            begin;
            drop materialized view if exists mv_construction_actors cascade;
            create materialized view mv_construction_actors as
            select resourceinstanceid,
                   __arches_get_concept_label(construction_actor_type) actor_type,
                   array_agg(construction_actor->'en'->>'value') actors,
                   array_remove(array_agg(construction_actor_notes->'en'->>'value'),'') notes
            from heritage_site.construction_actors
            group by resourceinstanceid, __arches_get_concept_label(construction_actor_type);
            create index mv_ca_idx on mv_construction_actors(resourceinstanceid);
            commit;
            """,
            """
            begin;
            drop materialized view if exists mv_construction_actors cascade;
            create materialized view mv_construction_actors as
            select resourceinstanceid,
                   __arches_get_concept_label(construction_actor_type) actor_type,
                   array_agg(construction_actor->'en'->>'value') actors
                    from heritage_site.construction_actors
            group by resourceinstanceid, __arches_get_concept_label(construction_actor_type);
            create index mv_ca_idx on mv_construction_actors(resourceinstanceid);
            commit;
            """,
        ),
        RunPrivilegedSQL(
            """
            begin;
            drop materialized view if exists mv_unique_property_address cascade;
            create materialized view mv_unique_property_address as
                select b.* from  heritage_site.instances i,
                databc.get_first_address(i.resourceinstanceid) b;
            create index mv_ua_idx on mv_unique_property_address(resourceinstanceid);
            commit;
            """,
            """
            begin;
            drop materialized view if exists mv_unique_property_address cascade;
            commit;
            """,
        ),
        RunPrivilegedSQL(
            """
            create or replace procedure refresh_materialized_views() as
            $$
            BEGIN
                refresh materialized view mv_bc_right;
                refresh materialized view mv_bc_statement_of_significance;
                refresh materialized view mv_borden_number;
                refresh materialized view mv_chronology;
                refresh materialized view mv_construction_actors;
                refresh materialized view mv_government;
                refresh materialized view mv_heritage_function;
                refresh materialized view mv_heritage_class;
                refresh materialized view mv_heritage_theme;
                refresh materialized view mv_legal_description;
                refresh materialized view mv_property_address;
                refresh materialized view mv_unique_property_address;
                refresh materialized view mv_protection_event;
                refresh materialized view mv_geojson_geoms;
                refresh materialized view mv_site_boundary;
                refresh materialized view mv_site_names;
                refresh materialized view mv_site_protection_event;
                refresh materialized view mv_site_record_admin;
            END
            $$ language plpgsql;
            """,
            """
            create or replace procedure refresh_materialized_views() as
            $$
            BEGIN
                refresh materialized view mv_bc_right;
                refresh materialized view mv_bc_statement_of_significance;
                refresh materialized view mv_borden_number;
                refresh materialized view mv_chronology;
                refresh materialized view mv_construction_actors;
                refresh materialized view mv_government;
                refresh materialized view mv_heritage_function;
                refresh materialized view mv_legal_description;
                refresh materialized view mv_property_address;
                refresh materialized view mv_protection_event;
                refresh materialized view mv_geojson_geoms;
                refresh materialized view mv_site_boundary;
                refresh materialized view mv_site_names;
                refresh materialized view mv_site_protection_event;
                refresh materialized view mv_site_record_admin;
            END
            $$ language plpgsql;
            """,
        ),
        RunPrivilegedSQL(
            """
            create or replace view V_HISTORIC_SITE as
            select distinct bn.resourceinstanceid,
                bn.borden_number,
                br.officially_recognized_site,
                br.registration_status registration_status,
                cn.name common_name,
                array_to_string(other_name.names, '; ') other_name,
                prop.pid,
                prop.street_address,
                prop.city,
                prop.postal_code,
                prop.province,
                prop.locality,
                prop.location_description,
                br.authorities,
                mc.chronology,
                significance_statement,
                ca.actors,
                hf.functional_states,
                ht.heritage_theme,
                hc.heritage_class,
                msb.area_sqm::numeric(19,2) dimensions_area_sqm,
                msb.site_centroid_latitude::numeric(10,6) gis_latitude,
                msb.site_centroid_longitude::numeric(10,6) gis_longitude,
                msb.utmzone::numeric(2,0) utm_zone,
                msb.utmnorthing::numeric(10,0) utm_northing,
                msb.utmeasting::numeric(10,0) utm_easting,
                'https://apps.nrs.gov.bc.ca/int/bcrhp/report/'||bn.resourceinstanceid site_url,
                msb.site_boundary,
                msra.bcrhp_submission_status,
                msra.restricted,
                msra.date_submitted_to_crhp
            from mv_borden_number bn
            left join (
                select resourceinstanceid, name
                from mv_site_names where name_type = 'Common'
            ) cn on cn.resourceinstanceid = bn.resourceinstanceid
            left join (
                select resourceinstanceid, array_agg(name) names
                from mv_site_names
                where name_type = 'Other'
                group by resourceinstanceid
            ) other_name on other_name.resourceinstanceid = bn.resourceinstanceid
            join (
                select distinct
                    r.resourceinstanceid,
                    r.officially_recognized_site,
                    r.registration_status,
                    jsonb_agg(
                        case when pe.authority is null then null else
                            jsonb_build_object(
                            'authority', pe.authority,
                            'auth_order', databc.authority_priority(pe.authority),
                            'start_date', pe.designation_or_protection_start_date,
                            'end_date', pe.designation_or_protection_end_date,
                            'government_name', pe.government_name,
                            'recognition_type', pe.recognition_type,
                            'reference_number', pe.reference_number,
                            'registry_types', r.registry_types
                        ) end order by databc.authority_priority(pe.authority) desc,
                        designation_or_protection_start_date desc
                    )->0 authorities
                from mv_bc_right r
                left join mv_site_protection_event pe on r.bc_right_id = pe.bc_right_id
                group by r.resourceinstanceid, r.officially_recognized_site, r.registration_status
            ) br on bn.resourceinstanceid = br.resourceinstanceid
            join mv_site_record_admin msra on bn.resourceinstanceid = msra.resourceinstanceid
            left join (
                select resourceinstanceid,
                    jsonb_agg(
                        jsonb_build_object(
                        'start_year', start_year,
                        'end_year', end_year,
                        'dates_approximate', dates_approximate,
                        'event', event,
                        'source', source,
                        'event_notes', event_notes
                        ) order by start_year
                    ) chronology
                from mv_chronology
                group by resourceinstanceid
            ) mc on bn.resourceinstanceid = mc.resourceinstanceid
            left join (
                select resourceinstanceid,
                    jsonb_object_agg(state_period, array_to_string(functional_states, '; ') ) functional_states
                from mv_heritage_function
                group by resourceinstanceid
            ) hf on bn.resourceinstanceid = hf.resourceinstanceid
            left join (
                select resourceinstanceid,
                    array_to_string(array_agg(heritage_theme), '; ') heritage_theme
                from mv_heritage_theme
                group by resourceinstanceid
            ) ht on bn.resourceinstanceid = ht.resourceinstanceid
            left join (
                select resourceinstanceid,
                    string_agg(
                        (elm->>'category')::text || ' ' ||
                        '(' || (elm->>'ownership')::text || ', ' ||
                        (elm->>'resource_count') || ')',
                        ', '
                    ) heritage_class
                from mv_heritage_class, jsonb_array_elements(heritage_class) elm
                group by resourceinstanceid
            ) hc on bn.resourceinstanceid = hc.resourceinstanceid
            left join (select resourceinstanceid,
                        jsonb_object_agg(
                                actor_type, jsonb_build_object('actors', array_to_string(actors, '; '), 'notes', array_to_string(notes, '; ') )
                            ) actors
                             from mv_construction_actors
                 group by resourceinstanceid order by resourceinstanceid
            ) ca on bn.resourceinstanceid = ca.resourceinstanceid
            left join mv_site_boundary msb on bn.resourceinstanceid = msb.resourceinstanceid
            left join (
                select resourceinstanceid,
                    jsonb_agg(
                        jsonb_build_object(
                        'significance_type', databc.html_to_plain_string(significance_type),
                        'significance_level', databc.authority_priority(significance_type),
                        'physical_description', databc.html_to_plain_string(physical_description),
                        'defining_elements', databc.html_to_plain_string(defining_elements),
                        'heritage_value', databc.html_to_plain_string(heritage_value),
                        'document_location', databc.html_to_plain_string(document_location)
                        )
                        order by databc.authority_priority(significance_type) desc
                    )->0 significance_statement
                from mv_bc_statement_of_significance
                group by resourceinstanceid
            ) sos on bn.resourceinstanceid = sos.resourceinstanceid
            left join mv_unique_property_address prop on bn.resourceinstanceid = prop.resourceinstanceid;
             """,
            """
             drop view if exists V_HISTORIC_SITE cascade;
             """,
        ),
        RunPrivilegedSQL(
            """
            create or replace view databc.V_HISTORIC_ENVIRO_ONEROW_SITE as
            select distinct
                resourceinstanceid site_id,
                borden_number borden_number,
                case when officially_recognized_site then 'Y' else 'N' end is_officially_recognized,
                registration_status registration_status,
                common_name,
                other_name,
                pid parcel_id,
                street_address,
                city,
                province,
                locality,
                location_description,
                authorities->>'government_name' government_name,
                authorities->>'authority' government_level,
                authorities->>'recognition_type' protection_type,
                to_date(authorities->>'start_date', 'YYYY-MM-DD') protection_start_date,
                authorities->>'reference_number' reference_number,
                case when chronology is null then null else
                    (select
                         to_char(to_date(a->>'start_year', 'YYYY-MM-DD'), 'YYYY')::numeric(4,0)
                     from jsonb_array_elements(chronology) a where a->>'event' = 'Construction' limit 1)
                    end construction_date,
                case when chronology is null then null else
                    (select case when (a->>'dates_approximate')::boolean then 'Circa' end
                     from jsonb_array_elements(chronology) a where a->>'event' = 'Construction' limit 1)
                    end construction_date_qualifier,               case when significance_statement is null then null else (significance_statement->>'significance_type') end significance_type,
                case when significance_statement is null then null else (significance_statement->>'physical_description') end physical_description,
                case when significance_statement is null then null else (significance_statement->>'heritage_value') end heritage_value,
                case when significance_statement is null then null else (significance_statement->>'defining_elements') end defining_elements,
                case when significance_statement is null then null else (significance_statement->>'document_location') end document_location,
                actors->'Architect / Designer'->>'actors' architect_name,
                actors->'Builder'->>'actors'  builder_name,
                functional_states->>'Current' current_function,
                functional_states->>'Historic' historic_function,
                dimensions_area_sqm,
                gis_latitude,
                gis_longitude,
                utm_zone,
                utm_northing,
                utm_easting,
                site_url,
                site_boundary
            from V_HISTORIC_SITE
            where bcrhp_submission_status in ('Approved - Basic Record','Approved - Full Record')
                and registration_status in ('Federal Jurisdiction', 'Recorded/Unprotected', 'Registered', 'Legacy')
                and not coalesce(restricted, false);
            DO
            $$
                DECLARE
                    databc_user text;
                BEGIN
                    select replace(current_database(), 'bcrhp','proxy_databc') into databc_user;
                    EXECUTE format('grant select on databc.v_historic_enviro_onerow_site to %s' ,quote_ident(databc_user));
                end;
            $$ language 'plpgsql';
            """,
            "",
        ),
        RunPrivilegedSQL(
            """
            create or replace view heritage_site.csv_export as
            select
                resourceinstanceid as site_id
                , coalesce(borden_number, '') as "Borden Number"
                , coalesce(common_name, '') "Common Name"
                , coalesce(other_name, '') "Other Name"
                , coalesce(street_address, '') as "Street Address"
                , coalesce(city, '') as "City"
                , coalesce(locality, '') as "Locality"
                , coalesce(postal_code, '') as "Postal Code"
                , coalesce(location_description, '') as "Location Description"
                , coalesce(registration_status, '') as "Registration Status"
                , coalesce((
                    select string_agg(elem::text, '; ')
                    from jsonb_array_elements_text(authorities->'registry_types') as elem
                ), '') as "Registry Type"
                , coalesce(authorities->>'government_name', '') as "Recognition Government"
                , coalesce(authorities->>'recognition_type', '') as "Recognition Type"
                , coalesce(authorities->>'reference_number', '') as "Reference Number"
                , coalesce(to_char(to_date(authorities->>'start_date', 'YYYY-MM-DD'), 'YYYY-MM-DD'), '') as "Recognition Start Date"
                , coalesce(to_char(to_date(authorities->>'end_date', 'YYYY-MM-DD'), 'YYYY-MM-DD'), '') as "Recognition End Date"
                , coalesce(actors->'Architect / Designer'->>'actors', '') as "Architect/Designer"
                , coalesce(actors->'Builder'->>'actors', '') as "Builder"
                , concat(coalesce(actors->'Architect / Designer'->>'notes', ''),  
                  (case when actors->'Architect / Designer'->>'notes' <> '' and actors->'Builder'->>'notes' <> '' then '; ' else '' end), 
                  coalesce(actors->'Builder'->>'notes', ''))
                 as "Architect/Builder Notes"
                , coalesce(chronology_data.chronology,'') as "Chronology"
                , coalesce(significance_statement->>'significance_type', '') as "SOS Type"
                , coalesce(significance_statement->>'physical_description', '') as "SOS Description"
                , coalesce(significance_statement->>'document_location', '') as "SOS Document Location"
                , coalesce(heritage_class, '') as "Heritage Class"
                , coalesce(functional_states->>'Current', '') as "Current Function"
                , coalesce(functional_states->>'Historic', '') as "Historic Function"
                , coalesce(heritage_theme, '') as "Heritage Theme"
            from V_HISTORIC_SITE
            left join lateral (
                select
                   string_agg(
                      concat(
                        case when c.value->>'event' <> '' then concat(c.value->>'event', ' ')end,
                        case when (c.value->>'dates_approximate')::boolean then 'Circa ' end,
                        coalesce(to_char(to_date(c.value->>'start_year', 'YYYY-MM-DD'), 'YYYY')::numeric(4,0)::text, ''), '-',
                        coalesce(to_char(to_date(c.value->>'end_year', 'YYYY-MM-DD'), 'YYYY')::numeric(4,0)::text, ''),
                        case when c.value->>'notes' <> '' then concat(': ', coalesce(c.value->>'notes', '-')) end
                    ), '; '
                ) as chronology
                from jsonb_array_elements(v_historic_site.chronology) as c(value)
            ) as chronology_data on true
            order by "Borden Number";
            DO
            $$
                DECLARE
                    app_user text;
                BEGIN
                    select current_database() into app_user;
                    EXECUTE format('grant select on heritage_site.csv_export to %s' ,quote_ident(app_user));
                end;
            $$ language 'plpgsql';
            """,
            """
            drop view if exists heritage_site.csv_export cascade;
            """,
        ),
    ]
