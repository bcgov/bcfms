from arches.app.utils.response import JSONResponse
from arches.app.views.api import APIBase
from rest_framework import status

import json

from rest_framework.generics import (
    ListCreateAPIView,
)
from rest_framework.parsers import JSONParser

from arches_querysets.rest_framework.multipart_json_parser import MultiPartJSONParser
from arches_querysets.rest_framework.pagination import ArchesLimitOffsetPagination
from arches_querysets.rest_framework.permissions import ReadOnly, ResourceEditor
from arches_querysets.rest_framework.serializers import (
    ArchesResourceSerializer,
    ArchesResourceTopNodegroupsSerializer,
    ArchesSingleNodegroupSerializer,
    ArchesTileSerializer,
)
from arches_querysets.rest_framework.view_mixins import ArchesModelAPIMixin


class IpaDetailsSerializer(ArchesTileSerializer):
    class Meta(ArchesTileSerializer.Meta):
        # used by ArchesModelAPIMixin
        graph_slug = "project_assessment"  # <- your graph
        root_node = "project_details"


class SubmitIPA(ArchesModelAPIMixin, ListCreateAPIView):
    permission_classes = [ResourceEditor | ReadOnly]
    serializer_class = IpaDetailsSerializer
    parser_classes = [JSONParser, MultiPartJSONParser]
    pagination_class = ArchesLimitOffsetPagination
    valid_keys = ["aliased_data"]

    def create(self, request, *args, **kwargs):
        # mirror your APIBase logic
        raw = request.data
        cleaned_object = {
            "aliased_data": raw.get("project_details")["project_details"][
                "aliased_data"
            ]
        }
        cleaned_object["aliased_data"]["project_site"]["aliased_data"][
            "project_location"
        ][
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

        # patched = {"aliased_data": cleaned_object}
        patched = cleaned_object
        print(patched)
        serializer = self.get_serializer(data=patched)
        if not serializer.is_valid():
            # print the errors you’re currently not seeing
            print("serializer.errors:", serializer.errors)
            return JSONResponse(serializer.errors, status=400)
        print("Made it here...")
        serializer.is_valid(raise_exception=True)
        print("Made it here2...")
        try:
            self.perform_create(serializer)
        except Exception as e:
            print(e)
        print("Made it here3...")
        headers = self.get_success_headers(serializer.data)
        return JSONResponse(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
