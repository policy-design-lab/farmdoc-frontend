#!/bin/sh

# exit on error, with error code
set -e

# use new docker build options
export DOCKER_BUILDKIT=1

# use DEBUG=echo ./release.sh to print all commands
export DEBUG=${DEBUG:-""}

export REACT_APP_ENV=${REACT_APP_ENV:-"development"}

${DEBUG} docker build --no-cache --build-arg REACT_APP_ENV="${REACT_APP_ENV}" --build-arg REACT_APP_DEMO_USER="${REACT_APP_DEMO_USER}" --build-arg REACT_APP_DEMO_PASSWORD="${REACT_APP_DEMO_PASSWORD}" --build-arg REACT_APP_DW_USER_ID="${REACT_APP_DW_USER_ID}" --build-arg REACT_APP_KEYCLOAK_URL="${REACT_APP_KEYCLOAK_URL}" --progress=plain --tag farmdoc/frontend .
