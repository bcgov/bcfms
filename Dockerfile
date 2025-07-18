FROM ubuntu:22.04 as base
USER root
ENV PROJECT_NAME=bcfms
## Setting default environment variables
ENV WEB_ROOT=/web_root
ENV APP_ROOT=${WEB_ROOT}/${PROJECT_NAME}
# Root project folder
ENV ARCHES_ROOT=${WEB_ROOT}/arches
ENV ARCHES_COMMON_ROOT=${WEB_ROOT}/bcgov-arches-common
ENV PG_TILESERV_ROOT=${WEB_ROOT}/pg_tileserv
ENV WHEELS=/wheels
ENV PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y make software-properties-common
# Get the pre-built python wheels from the build environment
RUN mkdir ${WEB_ROOT}
# Install packages required to run Arches
# Note that the ubuntu/debian package for libgdal1-dev pulls in libgdal1i, which is built
# with everything enabled, and so, it has a huge amount of dependancies (everything that GDAL
# support, directly and indirectly pulling in mysql-common, odbc, jp2, perl! ... )
# a minimised build of GDAL could remove several hundred MB from the container layer.
RUN set -ex \
  && RUN_DEPS=" \
  build-essential \
  python3.11-dev \
  mime-support \
  libgdal-dev \
  python3.11-venv \
  postgresql-client-16 \
  python3.11 \
  python3.11-distutils \
  python3.11-venv \
  dos2unix \
  git \
  gettext \
  " \
  && apt-get install -y --no-install-recommends curl \
  && curl -sL https://deb.nodesource.com/setup_20.x | bash - \
  && curl -sL https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
  && add-apt-repository "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -sc)-pgdg main" \
  && apt-get update -y \
  && apt-get install -y --no-install-recommends $RUN_DEPS \
  && curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py \
  && python3.11 get-pip.py \
  && apt-get install -y nodejs
#  && npm install -g yarn
# Install Yarn components
RUN mkdir -p ${APP_ROOT}/${PROJECT_NAME}/app/media/packages
WORKDIR ${WEB_ROOT}
RUN rm -rf /root/.cache/pip/*
# Install the Arches application
# FIXME: ADD from github repository instead?
COPY ./arches ${ARCHES_ROOT}
COPY ./bcgov-arches-common ${ARCHES_COMMON_ROOT}
# From here, run commands from ARCHES_ROOT
WORKDIR ${ARCHES_ROOT}
RUN pip install -e .[dev]&& \
    pip install python-dotenv boto3==1.26 django-storages==1.13 oracledb html2text cffi redis && \
    pip install --upgrade cryptography PyJWT

WORKDIR ${ARCHES_COMMON_ROOT}
RUN pip install -e .

COPY ./bcfms/docker/entrypoint.sh ${WEB_ROOT}/entrypoint.sh
RUN chmod -R 700 ${WEB_ROOT}/entrypoint.sh &&\
  dos2unix ${WEB_ROOT}/entrypoint.sh
RUN mkdir /var/log/supervisor
RUN mkdir /var/log/celery
# Set default workdir
WORKDIR ${APP_ROOT}
#COPY ../common/* ${PROJECT_NAME}/

# Install PG Tileserv software
ADD https://postgisftw.s3.amazonaws.com/pg_tileserv_latest_linux.zip ${PG_TILESERV_ROOT}

# # Set entrypoint
ENTRYPOINT ["../entrypoint.sh"]
CMD ["run_arches"]
# Expose port 8000
EXPOSE 8000