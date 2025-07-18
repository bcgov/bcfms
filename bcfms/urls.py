from django.urls import include, path, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns
from bcfms.views.api import MVT, CollectionEventFossilNames, ReportNumberGenerator
from bcgov_arches_common.views.map import (
    BCTileserverProxyView,
    BCTileserverLocalProxyView,
)
from bcfms.views.search import export_results as bcfms_export_results
from bcfms.views.root import BcfmsRootView
import re

uuid_regex = settings.UUID_REGEX
path_prefix_re = re.compile(r"^(\^)(.*)$")


def bc_path_prefix(path=""):
    if not settings.BCGOV_PROXY_PREFIX:
        return path
    else:
        if not path:
            return settings.BCGOV_PROXY_PREFIX
        new_path = path_prefix_re.sub(r"\1%s\2", path)
        return new_path % settings.BCGOV_PROXY_PREFIX


urlpatterns = [
    re_path(
        bc_path_prefix(r"^submissions/"), BcfmsRootView.as_view(), name="submissions"
    ),
    re_path(
        bc_path_prefix(r"^bctileserver/(?P<path>.*)$"),
        BCTileserverProxyView.as_view(),
        name="bcfms_tile_server",
    ),
    re_path(
        bc_path_prefix(r"^bclocaltileserver/(?P<path>.*)$"),
        BCTileserverLocalProxyView.as_view(),
        name="bcfms_local_tile_server",
    ),
    re_path(
        bc_path_prefix(
            r"^get_next_report_number/(?P<nodeid>%s)/(?P<typeAbbreviation>%s)$"
            % (uuid_regex, "[A-Z]{2,4}")
        ),
        ReportNumberGenerator.as_view(),
        name="get_next_report_number",
    ),
    re_path(
        bc_path_prefix(
            r"^mvt/(?P<nodeid>%s)/(?P<zoom>[0-9]+|\{z\})/(?P<x>[0-9]+|\{x\})/(?P<y>[0-9]+|\{y\}).pbf$"
            % uuid_regex
        ),
        MVT.as_view(),
        name="mvt",
    ),
    re_path(
        bc_path_prefix(
            r"^collection_event_fossil_names/(?P<collection_event_id>%s|())$"
            % uuid_regex
        ),
        CollectionEventFossilNames.as_view(),
        name="collection_event_fossil_names",
    ),
    # Override base export results
    re_path(
        bc_path_prefix(r"^search/export_results$"),
        bcfms_export_results,
        name="export_results",
    ),
    path(bc_path_prefix(), include("bcgov_arches_common.urls")),
    path(bc_path_prefix(), include("arches_component_lab.urls")),
    path(bc_path_prefix(), include("arches.urls")),
]

# Adds URL pattern to serve media files during development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Only handle i18n routing in active project. This will still handle the routes provided by Arches core and Arches applications,
# but handling i18n routes in multiple places causes application errors.
if settings.ROOT_URLCONF == __name__:
    if settings.SHOW_LANGUAGE_SWITCH is True:
        urlpatterns = i18n_patterns(*urlpatterns)

    urlpatterns.append(path("i18n/", include("django.conf.urls.i18n")))
