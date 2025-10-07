from django.db import migrations
from bcgov_arches_common.migrations.operations.privileged_sql import RunPrivilegedSQL


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    create_databc_proxy_schema = """
        create schema databc;
    """

    drop_databc_proxy_schema = """
        drop schema databc;
    """

    grant_databc_proxy_schema = """
        grant all privileges on schema databc to postgres;
    """

    create_databc_proxy_role = """
        DO
        $$
            DECLARE
                databc_role_exists boolean;
            BEGIN
                select count(*) > 0 into databc_role_exists from pg_roles where rolname = 'proxy_databc';
                if not databc_role_exists then
                    Raise NOTICE 'Creating role proxy_databc';
                    create role proxy_databc password 'proxy_databc';
                else
                    Raise NOTICE 'Not creating role proxy_databc - it already exists';
                end if;
                alter role proxy_databc with login;
                alter role proxy_databc set search_path = databc,public;
                revoke all on schema public from proxy_databc;
                grant connect on database bcfms to proxy_databc;
                grant usage on schema databc to proxy_databc;
                grant select on geometry_columns TO proxy_databc;
                grant select on geography_columns TO proxy_databc;
                grant select on spatial_ref_sys TO proxy_databc;
            END
        $$ language plpgsql;
    """

    drop_databc_proxy_role = """
        DO
        $$
            DECLARE
                databc_role record;
            BEGIN
                for databc_role in (select rolname from pg_roles where rolname = 'proxy_databc') loop
                    Raise NOTICE 'Dropping role proxy_databc and all associated grants';
                    drop owned by proxy_databc cascade;
                    drop role proxy_databc;
                end loop;
            END
        $$ language plpgsql;
    """

    operations = [
        RunPrivilegedSQL(
            create_databc_proxy_schema,
            drop_databc_proxy_schema,
        ),
        RunPrivilegedSQL(
            grant_databc_proxy_schema,
            migrations.RunSQL.noop,
        ),
        RunPrivilegedSQL(
            create_databc_proxy_role,
            drop_databc_proxy_role,
        ),
    ]
