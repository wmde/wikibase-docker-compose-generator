#!/bin/sh
set -e
cd [PATH_TO_PROJECT]
git pull
npm install
#uncomment the next line to restart the systemd service if you have setup one
#systemctl restart wikibase-docker-yml-gui
