#!/bin/sh

# Exit on error
set -e

# use DEBUG=echo
export DEBUG=${DEBUG:-""}

export SERVER=${SERVER:-"hub.ncsa.illinois.edu"}

# Requires jq package
VERSION=$(cat package.json | jq -r '.version')

# Find out what branch we are on
BRANCH=${BRANCH:-"$(git rev-parse --abbrev-ref HEAD)"}

# Use package version as tag for master & develop
if [ "$BRANCH" = "master" ]; then
    TAG=$VERSION
elif [ "${BRANCH}" = "develop" ]; then
    TAG="develop"
else
		# In the future we should allow pushes from branches?
		echo "Pushing from a branch that is not master or develop is not allowed"
		exit 0
fi

$DEBUG docker login $SERVER

# Push front end image
for v in ${TAG}; do
	if [ "$SERVER" != "" ]; then
		${DEBUG} docker tag farmdoc/frontend ${SERVER}/farmdoc/frontend:${v}
		${DEBUG} docker push ${SERVER}/farmdoc/frontend:${v}
	fi
done
