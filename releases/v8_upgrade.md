BCFMS
1. Need to rebuild docker container to fix dependencies
2. BCTileserverLocalProxyView was removed - commented out in urls.py, need to figure out what to do about it
3. `Migration models.12008_alter_file_path is applied before its dependency models.11869_rename_resxres_fields on database 'default'.` -
    1. Fix: `delete from django_migrations where app  = 'models' and name = '12008_alter_file_path';`
4. In dev needed to run: `python manage.py validate --fix 1012`
5. There are 5 publications with invalid author relationships. These should be deleted manually. They can be found using these SQL statements:
    ```sql
   select * from resource_x_resource where resourceinstanceidto is null or resourceinstanceidfrom is null;
   select * from publication.publication_details where resourceinstanceid in (
      '5479ccf0-db07-4964-b628-3dba2fccdac5',
      '99cc3525-334a-44da-9edb-946bde1e85dc',
      '70729097-167f-4ad4-b8ba-6e59f4374c72'
    );
   ```
   and can be navigated to using: `http://localhost:81/bc-fossil-management/resource/<UUID>` with the values above.