APP_NAME=bcfms
# If relative must start with a . (eg ./docker/deployer/config/)
CONFIG_DIR=./cd/docker/files/
LOG_DIR=./cd/docker/logs/
IMAGE_NAME=bcgov:arches-deployer-new
docker rm --force $APP_NAME-deployer
docker run -dit \
   -v $CONFIG_DIR:/home/runner/config \
   -v $LOG_DIR:/home/runner/logs \
   --name $APP_NAME-deployer \
   --env APP_ACRONYM=$APP_NAME \
   $IMAGE_NAME
#docker exec -it $APP_NAME-deployer /bin/bash
