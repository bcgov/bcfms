"""
ARCHES - a program developed to inventory and manage immovable cultural heritage.
Copyright (C) 2013 J. Paul Getty Trust and World Monuments Fund

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
"""

import os
from django.test import TestCase
from django.test.utils import captured_stdout
from arches.app.models.graph import Graph
from arches.app.models.models import Ontology
from arches.app.models.system_settings import settings
from arches.app.utils.betterJSONSerializer import JSONSerializer, JSONDeserializer
from arches.app.utils.data_management.resource_graphs.importer import (
    import_graph as ResourceGraphImporter,
)
from arches.app.utils.data_management.resources.importer import BusinessDataImporter
from bcfms.tests import test_settings
from arches.app.utils.context_processors import app_settings
from arches.app.utils.skos import SKOSReader
from django.db import connection
from django.core import management
from django.test.runner import DiscoverRunner
from oauth2_provider.models import Application

from arches.app.search.mappings import (
    prepare_terms_index,
    delete_terms_index,
    prepare_concepts_index,
    delete_concepts_index,
    prepare_search_index,
    delete_search_index,
)

# these tests can be run from the command line via
# python manage.py test tests --pattern="*.py" --settings="tests.test_settings"

OAUTH_CLIENT_ID = "AAac4uRQSqybRiO6hu7sHT50C4wmDp9fAmsPlCj9"
OAUTH_CLIENT_SECRET = "7fos0s7qIhFqUmalDI1QiiYj0rAtEdVMY4hYQDQjOxltbRCBW3dIydOeMD4MytDM9ogCPiYFiMBW6o6ye5bMh5dkeU7pg1cH86wF6B\
        ap9Ke2aaAZaeMPejzafPSj96ID"
CREATE_TOKEN_SQL = """
        INSERT INTO public.oauth2_provider_accesstoken(
            token, expires, scope, application_id, user_id, created, updated)
            VALUES ('{token}', '1-1-2068', 'read write', 44, {user_id}, '1-1-2018', '1-1-2018');
    """
DELETE_TOKEN_SQL = (
    "DELETE FROM public.oauth2_provider_accesstoken WHERE application_id = 44;"
)

PACKAGE_ROOT = os.path.join(settings.APP_ROOT, "pkg")


class ArchesTestRunner(DiscoverRunner):
    def setup_databases(self, **kwargs):
        ret = super().setup_databases(**kwargs)

        app_settings()  # adds languages to system
        prepare_terms_index(create=True)
        prepare_concepts_index(create=True)
        prepare_search_index(create=True)

        # Setup the base config - functions, widgets, vocabularies, ontologies and graphs
        # Load app functions
        file_paths = [
            os.path.abspath(os.path.join(settings.APP_ROOT, "functions", file_path))
            for file_path in (os.listdir(os.path.join(settings.APP_ROOT, "functions")))
            if file_path.endswith(".py") and file_path != "__init__.py"
        ] + [
            os.path.abspath(os.path.join(settings.COMMON_ROOT, "functions", file_path))
            for file_path in (
                os.listdir(os.path.join(settings.COMMON_ROOT, "functions"))
            )
            if file_path.endswith(".py") and file_path != "__init__.py"
        ]
        for file_path in file_paths:
            management.call_command("fn", "register", "-s", file_path)

        # Load app widgets
        file_paths = [
            os.path.abspath(os.path.join(settings.APP_ROOT, "widgets", file_path))
            for file_path in os.listdir(os.path.join(settings.APP_ROOT, "widgets"))
            if file_path.endswith(".json")
        ] + [
            os.path.abspath(os.path.join(settings.COMMON_ROOT, "widgets", file_path))
            for file_path in os.listdir(os.path.join(settings.COMMON_ROOT, "widgets"))
            if file_path.endswith(".json")
        ]

        for file_path in file_paths:
            management.call_command("widget", "register", "-s", file_path)

        for skospath in [
            os.path.join(
                PACKAGE_ROOT,
                "reference_data",
                "concepts",
                "bcgov_fossils_concept_scheme.xml",
            ),
            os.path.join(
                PACKAGE_ROOT,
                "reference_data",
                "collections",
                "bc_fossils_collections.xml",
            ),
        ]:
            skos = SKOSReader()
            rdf = skos.read_file(skospath)
            skos.save_concepts_from_skos(rdf)

        # Load ontologies
        ArchesTestCase.loadOntology()

        # Load graphs
        file_paths = [
            os.path.join(
                settings.APP_ROOT, "pkg", "graphs", "resource_models", file_path
            )
            for file_path in os.listdir(
                os.path.join(settings.APP_ROOT, "pkg", "graphs", "resource_models")
            )
            if file_path.endswith(".json")
        ]
        for file_path in file_paths:
            with captured_stdout() as captured:
                with open(file_path, "r") as f:
                    archesfile = JSONDeserializer().deserialize(f)
                    errs, importer = ResourceGraphImporter(
                        archesfile["graph"], overwrite_graphs=True
                    )
                print(captured)

        return ret

    def teardown_databases(self, old_config, **kwargs):
        delete_terms_index()
        delete_concepts_index()
        delete_search_index()

        super().teardown_databases(old_config, **kwargs)


class ArchesTestCase(TestCase):
    def __init__(self, *args, **kwargs):
        super(ArchesTestCase, self).__init__(*args, **kwargs)
        if settings.DEFAULT_BOUNDS is None:
            with open(
                os.path.join(
                    "tests/fixtures/system_settings/Arches_System_Settings_Model.json"
                ),
                "r",
            ) as f:
                archesfile = JSONDeserializer().deserialize(f)
            ResourceGraphImporter(archesfile["graph"], True)
            BusinessDataImporter(
                "tests/fixtures/system_settings/Arches_System_Settings_Local.json"
            ).import_business_data()
            settings.update_from_db()

    @classmethod
    def loadOntology(cls):
        ontologies_count = Ontology.objects.exclude(ontologyid__isnull=True).count()
        if ontologies_count == 0:
            management.call_command("load_ontology", source=test_settings.ONTOLOGY_PATH)

    @classmethod
    def setUpClass(cls):
        # Account for the fact that some test classes may be failing to call
        # super().tearDownClass() in their tearDownClass() implementations.
        try:
            Application.objects.get(id=44)
        except Application.DoesNotExist:
            pass
        else:
            return

        cursor = connection.cursor()
        sql = """
            INSERT INTO public.oauth2_provider_application(
                id, client_id, redirect_uris, client_type, authorization_grant_type,
                client_secret,
                name, user_id, skip_authorization, created, updated, algorithm)
            VALUES (
                44, '{oauth_client_id}', 'http://localhost:8000/test', 'public', 'client-credentials',
                '{oauth_client_secret}',
                'TEST APP', {user_id}, false, '1-1-2000', '1-1-2000', '{jwt_algorithm}');
        """

        sql = sql.format(
            user_id=1,
            oauth_client_id=OAUTH_CLIENT_ID,
            oauth_client_secret=OAUTH_CLIENT_SECRET,
            jwt_algorithm=test_settings.JWT_ALGORITHM,
        )
        cursor.execute(sql)

    @classmethod
    def tearDownClass(cls):
        cursor = connection.cursor()
        sql = "DELETE FROM public.oauth2_provider_application WHERE id = 44;"
        cursor.execute(sql)

    @classmethod
    def deleteGraph(cls, root):
        graph = Graph.objects.get(graphid=str(root))
        graph.delete()

    def setUp(self):
        pass

    def tearDown(self):
        pass
