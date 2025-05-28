DO
$$
    DECLARE
        databc_user text;
    BEGIN
        select replace(current_database(), 'bcfms','proxy_databc') into databc_user;
        EXECUTE format('grant select on databc.important_fossil_areas_vw to %s;', quote_ident(databc_user));
        EXECUTE format('grant select on databc.fossil_sites_vw to %s;', quote_ident(databc_user));
        EXECUTE format('grant select on databc.provincially_protected_fossil_sites_vw to %s;', quote_ident(databc_user));
        EXECUTE format('grant select on databc.collection_events_vw to %s;', quote_ident(databc_user));
        EXECUTE format('grant select on public.nodes to %s;', quote_ident(databc_user));
        EXECUTE format('grant select on public.values to %s;', quote_ident(databc_user));
        EXECUTE format('grant select on public.concepts to %s;', quote_ident(databc_user));
    end;
$$ language 'plpgsql';

