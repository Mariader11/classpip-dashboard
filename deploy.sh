#!/bin/sh

curl -H "Content-Type: application/json" --data '{"build": true}' -X POST https://registry.hub.docker.com/u/classpip/classpip-dashboard/trigger/$DOCKER_HUB_TOKEN/
