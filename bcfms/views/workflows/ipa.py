from arches.app.utils.response import JSONResponse
from arches.app.views.api import APIBase
import json


class SubmitIPA(APIBase):

    def patch_data(self, project_details):
        return {"aliased_data": {"project_details": project_details.projectDetails}}

    def post(self, request):
        data = json.loads(request.body)
        project_details = data
        print(project_details)
        return JSONResponse(
            status=201,
            reason="Resource created",
            content=project_details,
        )
