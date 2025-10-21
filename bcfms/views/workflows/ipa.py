from datetime import date
import traceback
from urllib.parse import urlparse, parse_qs
from arches.app.utils.response import JSONResponse
from arches.app.models.concept import Concept
from rest_framework import status
from bcfms.util.business_data_proxy import (
    IPADataProxy,
)
from arches_component_lab.views.node_config_mixin import CardNodeWidgetConfigMixin

from rest_framework.generics import ListCreateAPIView, CreateAPIView
from rest_framework.parsers import JSONParser

from arches_querysets.rest_framework.multipart_json_parser import MultiPartJSONParser
from arches_querysets.rest_framework.pagination import ArchesLimitOffsetPagination
from arches_querysets.rest_framework.permissions import ReadOnly, ResourceEditor
from arches_querysets.rest_framework.serializers import (
    ArchesResourceSerializer,
)
from arches_querysets.rest_framework.view_mixins import ArchesModelAPIMixin


class IpaSerializer(ArchesResourceSerializer):
    class Meta(ArchesResourceSerializer.Meta):
        # used by ArchesModelAPIMixin
        graph_slug = "project_assessment"

        # Extend base extra_kwargs so DRF doesn't require these on input.
        extra_kwargs = {
            **getattr(ArchesResourceSerializer.Meta, "extra_kwargs", {}),
            "graph": {"required": False, "allow_null": True},
            "resourceinstanceid": {
                "required": False,
                "allow_null": True,
                "read_only": True,
            },
        }

    def __init__(self, *args, graph_slug=None, context=None, **kwargs):
        # This is required because ArchesResourceSerializer is not picking up the
        # slug from the Meta field
        graph_slug = graph_slug or getattr(self.Meta, "graph_slug", None)
        super().__init__(*args, context=context, graph_slug=graph_slug, **kwargs)

    @property
    def graph_slug(self):
        return getattr(self, "_graph_slug", None) or getattr(
            self.Meta, "graph_slug", None
        )


class SubmitIPA(ArchesModelAPIMixin, CardNodeWidgetConfigMixin, CreateAPIView):
    permission_classes = [ResourceEditor | ReadOnly]
    serializer_class = IpaSerializer
    parser_classes = [JSONParser, MultiPartJSONParser]
    pagination_class = ArchesLimitOffsetPagination
    valid_keys = ["aliased_data"]

    def get_agreement_uuid(self):
        repo_agreement_config = self.get_card_x_node_x_widget(
            "project_assessment", "fossil_repository_agreement"
        )
        url = repo_agreement_config.config["url"]
        concept_id = parse_qs(urlparse(url).query).get("conceptid", [None])[0]

        parent_concept = Concept().get(concept_id)
        child_concepts = parent_concept.get_child_collections(
            concept_id,
        )

        filtered = [t for t in child_concepts if t[1].lower() == "to be determined"]

        # print(f"Returning {filtered[0][2]}")
        return filtered[0][2] if filtered else None

    def patch_data(self, ipa):
        print("!!!! PATCH until location is added")
        ipa["aliased_data"]["project_details"]["aliased_data"]["project_site"][
            "aliased_data"
        ]["project_location"][
            "node_value"
        ] = """{
                   "type": "FeatureCollection",
                   "features": [
                      {
                         "geometry": {
                            "coordinates": [
                               -122.9167,
                               51.0861
                            ],
                            "type": "Point"
                         },
                         "id": "205ea789-1643-4061-a05c-826626c60d48",
                         "properties": {},
                         "type": "Feature"
                      }
                   ]
                }"""

        ipa_number_config = self.get_card_x_node_x_widget(
            "project_assessment", "ipa_number"
        )
        report_number = IPADataProxy().get_last_report_id(
            ipa_number_config.node_id, report_type_abbreviation="IPA"
        )
        print(f"Report number: {report_number}")

        agreement_uuid = self.get_agreement_uuid()

        ipa["aliased_data"]["assessment_details"]["aliased_data"]["ipa_number"][
            "node_value"
        ] = report_number
        ipa["aliased_data"]["assessment_details"]["aliased_data"][
            "assessment_start_date"
        ]["node_value"] = date.today().strftime("%Y-%m-%d")
        ipa["aliased_data"]["assessment_details"]["aliased_data"][
            "fossil_repository_agreement"
        ]["node_value"] = agreement_uuid
        return ipa

    def create(self, request, *args, **kwargs):
        raw = request.data
        cleaned_object = {
            "aliased_data": {
                "project_details": raw.get("project_details")["project_details"],
                "assessment_details": raw.get("project_details")["assessment_details"],
            },
        }
        # print(f"\n\n\nBefore: {cleaned_object}\n\n\n")
        patched = self.patch_data(cleaned_object)
        # print(f"\n\n\nCleaned: {patched}\n\n\n")
        serializer = self.get_serializer(data=patched)
        if not serializer.is_valid():
            # print the errors you’re currently not seeing
            print("serializer.errors:", serializer.errors)
            return JSONResponse(serializer.errors, status=400)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
        except Exception as e:
            print(f"Unable to create: {e}")
            traceback.print_exc()
            return JSONResponse(
                {
                    "error": "Unable to create resource",
                    "message": str(e),
                    "type": e.__class__.__name__,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        headers = self.get_success_headers(serializer.data)
        return JSONResponse(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
