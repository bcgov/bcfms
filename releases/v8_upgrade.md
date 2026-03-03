BCFMS
1. Need to rebuild docker container to fix dependencies
2. BCTileserverLocalProxyView was removed - commented out in urls.py, need to figure out what to do about it
3. `Migration models.12008_alter_file_path is applied before its dependency models.11869_rename_resxres_fields on database 'default'.` -
    1. Fix: `delete from django_migrations where app  = 'models' and name = '12008_alter_file_path';`
4. In dev needed to run: `python manage.py validate --fix 1012`
