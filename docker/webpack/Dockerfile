FROM ubuntu:22.04 as base 
USER root
ENV WEB_ROOT=/web_root
ENV ARCHES_ROOT=${WEB_ROOT}/arches
ENV APP_ROOT=${WEB_ROOT}/bcfms
ENV ARCHES_COMMON=${WEB_ROOT}/bcgov-arches-common
#ENV AFS_ROOT=${WEB_ROOT}/arches-for-science
ENV NODE_MAJOR=20
RUN mkdir -p ${APP_ROOT}/bcfms/webpack

RUN apt-get update && apt-get install -y make software-properties-common && apt-get install -y ca-certificates curl gnupg && mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && apt-get update

RUN set -ex \
  && apt-get update -y \
  && RUN_DEPS=" \
  build-essential \
  python3.11-dev \
  mime-support \
  libgdal-dev \
  python3-venv \
  python3.11 \
  python3.11-distutils \
  python3.11-venv \
  dos2unix \
  git \
  vim \
  " \
  && apt-get install -y --no-install-recommends curl \
  && apt-get install -y --no-install-recommends $RUN_DEPS 

RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && python3 get-pip.py \
  && pip install setuptools python-dotenv django-storages

COPY ./arches ${ARCHES_ROOT}
COPY ./bcgov-arches-common ${ARCHES_COMMON}

RUN apt-get update && apt-get -y install curl \
  && apt-get install nodejs && apt install wait-for-it

#WORKDIR ${AFS_ROOT}
#RUN pip show setuptools && pip --version && pip install -e . && pip uninstall arches -y

WORKDIR ${ARCHES_ROOT}
RUN pip install -e . --user

WORKDIR ${ARCHES_COMMON}
RUN pip install -e .

COPY /bcfms/docker/webpack/entrypoint.sh ${WEB_ROOT}/entrypoint.sh
RUN chmod -R 700 ${WEB_ROOT}/entrypoint.sh
WORKDIR ${WEB_ROOT}
ENTRYPOINT [ "./entrypoint.sh" ]
CMD ["run_webpack"]
EXPOSE 8021
