from ..base_test import ArchesTestCase
from bcfms.util.business_data_proxy import IPADataProxy

import uuid
import os

from django.db import connection
from arches.app.models.system_settings import settings
from arches.app.models import models

PACKAGE_ROOT = os.path.join(settings.APP_ROOT, "pkg")
REFERENCE_DATA_ROOT = os.path.join(PACKAGE_ROOT, "reference_data")


class TestIPADataProxy(ArchesTestCase):
    def setUp(self):

        cursor = connection.cursor()
        cursor.execute(
            """ 
                    with graph as (select * from graphs where slug = 'project_assessment')
                        select __arches_create_resource_model_views(graph.graphid) from graph;
         """
        )
        cursor.execute("drop function if exists bc_i18n;")
        cursor.execute(
            """ 
        create or replace function bc_i18n(value text) returns jsonb as
        $$
        DECLARE
        begin
            return json_build_object('en', json_build_object('value', coalesce(value, ''), 'direction', 'ltr'));
        end
        $$
            language plpgsql;
                 """
        )
        pass

    def add_ipa_number(self, abbreviation):
        ipa_uuid = uuid.uuid4()

        with connection.cursor() as cursor:
            cursor.execute(
                """insert into industry_project_assessment.instances(resourceinstanceid)
            values(%(ipa_uuid)s);""",
                {"ipa_uuid": ipa_uuid},
            )
            cursor.execute(
                """insert into industry_project_assessment.assessment_details(resourceinstanceid,
                                                           ipa_number,
                                                           assessment_start_date,
                                                           project_requirements,
                                                           fossil_repository_agreement,
                                                           other_requirement_details)
                values( %(ipa_uuid)s,
                       %(abbreviation)s,
                       current_date,
                       null,
                       null,
                       bc_i18n(''));
                """,
                {"ipa_uuid": ipa_uuid, "abbreviation": abbreviation},
            )
        return ipa_uuid

    def test_get_last_report_id_bad_call(self):
        ipa_number_node = models.Node.objects.get(alias="ipa_number")
        self.assertIsNotNone(ipa_number_node)
        try:
            ipa_number = IPADataProxy.get_last_report_id(node_id=ipa_number_node.nodeid)
        except Exception as e:
            self.assertEqual(
                e.__class__, ValueError().__class__, "Wrong exception type"
            )
            self.assertEqual(
                str(e),
                "Either an abbreviation or value ID must be provided.",
                "Wrong error message",
            )

    def test_get_last_report_id_bad_value_id(self):
        ipa_number_node = models.Node.objects.get(alias="ipa_number")
        self.assertIsNotNone(ipa_number_node)
        try:
            ipa_number = IPADataProxy.get_last_report_id(
                node_id=ipa_number_node.nodeid, value_id=uuid.uuid4()
            )
        except Exception as e:
            self.assertEqual(
                e.__class__, ValueError().__class__, "Wrong exception type"
            )
            self.assertTrue(
                str(e).startswith("Value ID does not exist"), "Wrong error message"
            )

    def test_get_last_report_id_invalid_value_id(self):
        ipa_number_node = models.Node.objects.get(alias="ipa_number")
        self.assertIsNotNone(ipa_number_node)
        try:
            ipa_number = IPADataProxy.get_last_report_id(
                node_id=ipa_number_node.nodeid, value_id="null"
            )
        except Exception as e:
            self.assertEqual(
                e.__class__, ValueError().__class__, "Wrong exception type"
            )
            self.assertTrue("is not a valid UUID" in str(e), "Wrong error message")

    def test_get_last_report_id_no_abbreviation(self):
        ipa_number_node = models.Node.objects.get(alias="ipa_number")
        self.assertIsNotNone(ipa_number_node)
        try:
            bad_node = models.Value.objects.filter(value="Few (< 5)").first()
            ipa_number = IPADataProxy.get_last_report_id(
                node_id=ipa_number_node.nodeid, value_id=bad_node.valueid
            )
        except Exception as e:
            self.assertEqual(
                e.__class__, ValueError().__class__, "Wrong exception type"
            )
            self.assertTrue(str(e).endswith("does not have an abbreviation value."))

    def test_get_last_report_id_with_abbreviation(self):
        ipa_number_node = models.Node.objects.get(alias="ipa_number")
        self.assertIsNotNone(ipa_number_node)
        ipa_number = IPADataProxy.get_last_report_id(
            node_id=ipa_number_node.nodeid, report_type_abbreviation="IPA"
        )
        self.assertEqual("2025-IPA-001", ipa_number)
        ipa_uuid = self.add_ipa_number("2025-IPA-005")
        tile = models.TileModel.objects.filter(resourceinstance_id=ipa_uuid).first()
        ipa_number = IPADataProxy.get_last_report_id(
            node_id=ipa_number_node.nodeid, report_type_abbreviation="IPA"
        )
        self.assertEqual("2025-IPA-006", ipa_number)

    def test_get_last_report_id_with_value_id(self):
        submission_number_node = models.Node.objects.get(alias="submission_number")
        self.assertIsNotNone(submission_number_node)
        cfp_node = models.Value.objects.filter(value="Chance Find Protocol").first()
        cfp_number = IPADataProxy.get_last_report_id(
            node_id=submission_number_node.nodeid, value_id=cfp_node.valueid
        )
        self.assertEqual("2025-CFP-001", cfp_number)
