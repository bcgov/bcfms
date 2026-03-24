from bcfms.settings import *
from bcfms import __version__


def deployment_settings(request=None):
    return {
        "deployment_settings": {
            "DEPLOYMENT_TIMESTAMP": (
                DEPLOYMENT_TIMESTAMP if DEPLOYMENT_TIMESTAMP else ""
            ),
            "VERSION": __version__,
        }
    }
