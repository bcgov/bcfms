# tests/test_submit_ipa.py
import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()


def test_submit_ipa_accepts_json(api_client):
    url = "http://localhost:81/bc-fossil-management/api/submit_ipa/"

    payload = {
        "aliased_data": {
            "projectDetails": {
                "project_name": {
                    "display_value": "Some project name",
                    "node_value": {
                        "en": {"value": "Some project name", "direction": "ltr"},
                        "en-US": {"value": "", "direction": "ltr"},
                        "fr": {"value": "", "direction": "ltr"},
                        "zh": {"value": "", "direction": "ltr"},
                        "de": {"value": "", "direction": "ltr"},
                        "pt": {"value": "", "direction": "ltr"},
                        "ru": {"value": "", "direction": "ltr"},
                        "el": {"value": "", "direction": "ltr"},
                        "en-us": {"value": "", "direction": "ltr"},
                    },
                    "details": [],
                },
                "project_initiator": {
                    "display_value": "Ager, J.",
                    "node_value": {
                        "inverseOntologyProperty": "",
                        "ontologyProperty": "",
                        "resourceId": "f270eec8-c7af-4a9c-903e-29a035056a57",
                        "resourceXresourceId": "",
                    },
                    "details": [
                        {
                            "display_value": "Ager, J.",
                            "resource_id": "f270eec8-c7af-4a9c-903e-29a035056a57",
                        }
                    ],
                },
                "industry_company_name": {
                    "display_value": "Industry Company",
                    "node_value": {
                        "en": {"value": "Industry Company", "direction": "ltr"},
                        "en-US": {"value": "", "direction": "ltr"},
                        "fr": {"value": "", "direction": "ltr"},
                        "zh": {"value": "", "direction": "ltr"},
                        "de": {"value": "", "direction": "ltr"},
                        "pt": {"value": "", "direction": "ltr"},
                        "ru": {"value": "", "direction": "ltr"},
                        "el": {"value": "", "direction": "ltr"},
                        "en-us": {"value": "", "direction": "ltr"},
                    },
                    "details": [],
                },
                "project_authorizing_agency": {
                    "display_value": "Oil and Gas Commission (OGC)",
                    "node_value": "c8b9d134-8cb3-47d1-a197-533279a504fe",
                    "details": [
                        {
                            "children": [],
                            "collector": "",
                            "conceptid": "5f023e27-a616-439b-9b85-b2f16774e2b6",
                            "id": "c8b9d134-8cb3-47d1-a197-533279a504fe",
                            "key": "c8b9d134-8cb3-47d1-a197-533279a504fe",
                            "label": "Oil and Gas Commission (OGC)",
                            "sortorder": "",
                            "text": "Oil and Gas Commission (OGC)",
                        }
                    ],
                },
                "land_act_file_number": {
                    "display_value": "12345",
                    "node_value": {
                        "en": {"value": "12345", "direction": "ltr"},
                        "en-US": {"value": "", "direction": "ltr"},
                        "fr": {"value": "", "direction": "ltr"},
                        "zh": {"value": "", "direction": "ltr"},
                        "de": {"value": "", "direction": "ltr"},
                        "pt": {"value": "", "direction": "ltr"},
                        "ru": {"value": "", "direction": "ltr"},
                        "el": {"value": "", "direction": "ltr"},
                        "en-us": {"value": "", "direction": "ltr"},
                    },
                    "details": [],
                },
                "project_start_date": {
                    "display_value": "",
                    "node_value": "2025-10-07",
                    "details": [],
                },
                "project_end_date": {
                    "display_value": "2025-10-16",
                    "node_value": "2025-10-16",
                    "details": [],
                },
                "project_type": {
                    "display_value": "Adventure tourism",
                    "node_value": "aef1e8ce-160e-4cde-879c-53dae363f13f",
                    "details": [
                        {
                            "children": [],
                            "collector": "",
                            "conceptid": "0c9ed2ee-e3a5-4fdf-9a58-8d331b4b1ff5",
                            "id": "aef1e8ce-160e-4cde-879c-53dae363f13f",
                            "key": "aef1e8ce-160e-4cde-879c-53dae363f13f",
                            "label": "Adventure tourism",
                            "sortorder": "",
                            "text": "Adventure tourism",
                        }
                    ],
                },
                "other_project_type": {
                    "display_value": "Proposed Activity",
                    "node_value": {
                        "en": {"value": "Proposed Activity", "direction": "ltr"},
                        "en-US": {"value": "", "direction": "ltr"},
                        "fr": {"value": "", "direction": "ltr"},
                        "zh": {"value": "", "direction": "ltr"},
                        "de": {"value": "", "direction": "ltr"},
                        "pt": {"value": "", "direction": "ltr"},
                        "ru": {"value": "", "direction": "ltr"},
                        "el": {"value": "", "direction": "ltr"},
                        "en-us": {"value": "", "direction": "ltr"},
                    },
                    "details": [],
                },
                "proposed_activity": {
                    "display_value": "",
                    "node_value": {"en": {"value": "", "direction": "ltr"}},
                    "details": [],
                },
                "location_description": {
                    "display_value": "Location Description",
                    "node_value": {
                        "en": {"value": "Location Description", "direction": "ltr"},
                        "en-US": {"value": "", "direction": "ltr"},
                        "fr": {"value": "", "direction": "ltr"},
                        "zh": {"value": "", "direction": "ltr"},
                        "de": {"value": "", "direction": "ltr"},
                        "pt": {"value": "", "direction": "ltr"},
                        "ru": {"value": "", "direction": "ltr"},
                        "el": {"value": "", "direction": "ltr"},
                        "en-us": {"value": "", "direction": "ltr"},
                    },
                    "details": [],
                },
                "geometry_qualifier": {
                    "display_value": "datum point",
                    "node_value": "c5850903-6df6-41fa-8197-a1da8df86a15",
                    "details": [
                        {
                            "children": [],
                            "collector": "",
                            "conceptid": "968c8825-3f14-4e24-8f49-d2393de86415",
                            "id": "c5850903-6df6-41fa-8197-a1da8df86a15",
                            "key": "c5850903-6df6-41fa-8197-a1da8df86a15",
                            "label": "datum point",
                            "sortorder": "",
                            "text": "datum point",
                        }
                    ],
                },
                "multiple_geometry_qualifier": {
                    "display_value": "<p>Some&nbsp;geometry&nbsp;qualifier</p>",
                    "node_value": {
                        "en": {
                            "value": "<p>Some&nbsp;geometry&nbsp;qualifier</p>",
                            "direction": "ltr",
                        },
                        "en-US": {"value": "", "direction": "ltr"},
                        "fr": {"value": "", "direction": "ltr"},
                        "zh": {"value": "", "direction": "ltr"},
                        "de": {"value": "", "direction": "ltr"},
                        "pt": {"value": "", "direction": "ltr"},
                        "ru": {"value": "", "direction": "ltr"},
                        "el": {"value": "", "direction": "ltr"},
                        "en-us": {"value": "", "direction": "ltr"},
                    },
                    "details": [],
                },
            },
            "initialProjectReview": {},
        }
    }

    resp = api_client.post(url, payload, format="json")

    # Adjust the expected codes to what your endpoint returns (often 201 or 200).
    assert resp.status_code in (
        200,
        201,
        202,
    ), f"Unexpected status: {resp.status_code} | body={getattr(resp, 'data', resp.content)}"
