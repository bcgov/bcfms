from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import ensure_csrf_cookie
from arches.app.models.system_settings import settings
from arches.app.views.base import BaseManagerView


class BcfmsRootView(BaseManagerView):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        context = self.get_context_data(main_script="/views/root")
        context["page_title"] = _("BCFMS Self Service")
        return render(
            request,
            (
                "bc-fossil-management/root_vue_dev.htm"
                if settings.DJANGO_VITE["default"]["dev_mode"]
                else "bc-fossil-management/root.htm"
            ),
            context,
        )
