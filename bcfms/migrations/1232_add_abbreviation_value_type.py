from django.db import migrations

add_value_type = """
    insert into d_value_types (valuetype, category, namespace, datatype) 
    values ('abbreviation', 'undefined', 'arches', 'text');
    """

delete_value_type = """
    delete from d_value_types  where valuetype = 'abbreviation';
   """


class Migration(migrations.Migration):
    dependencies = [
        ("bcfms", "1222_disable_download_email_notifications"),
    ]

    operations = [
        migrations.RunSQL(add_value_type, delete_value_type),
    ]
