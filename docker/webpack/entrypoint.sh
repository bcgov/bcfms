#! /bin/bash

APP_FOLDER=${WEB_ROOT}/${ARCHES_PROJECT}
run_webpack() {
	echo ""
	echo "----- *** RUNNING WEBPACK DEVELOPMENT SERVER *** -----"
	echo ""
	cd ${APP_FOLDER}
    echo "Running Webpack"
	exec sh -c "cd /web_root/bcfms && npm install && wait-for-it bcfms:80 -t 1200 && npm run start"
}

run_webpack