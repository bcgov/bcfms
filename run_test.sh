# --keepdb flag can be pass to this script to examine the database after begin run
python manage.py  test bcfms.tests $1 --pattern="*.py" --settings="bcfms.tests.test_settings"
