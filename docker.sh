#!/bin/sh

# exit on error, with error code
set -e

# use new docker build options
export DOCKER_BUILDKIT=1

# use DEBUG=echo ./release.sh to print all commands
export DEBUG=${DEBUG:-""}

export DEPLOY_ENV=${DEPLOY_ENV:-"develop"}

${DEBUG} docker build --build-arg DEPLOY_ENV="${DEPLOY_ENV}" --progress=plain --tag farmdoc/frontend .
