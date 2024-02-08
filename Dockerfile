# ----------------------------------------------------------------------
# Build application using node
# ----------------------------------------------------------------------

FROM node:14.5.0-alpine AS builder

WORKDIR /usr/src/app

ARG REACT_APP_ENV=""
ENV REACT_APP_ENV=${REACT_APP_ENV}

ARG REACT_APP_DEMO_USER=""
ENV REACT_APP_DEMO_USER=${REACT_APP_DEMO_USER}

ARG REACT_APP_DEMO_PASSWORD=""
ENV REACT_APP_DEMO_PASSWORD=${REACT_APP_DEMO_PASSWORD}

ARG REACT_APP_DW_USER_ID=""
ENV REACT_APP_DW_USER_ID=${REACT_APP_DW_USER_ID}

ARG REACT_APP_KEYCLOAK_URL=""
ENV REACT_APP_KEYCLOAK_URL=${REACT_APP_KEYCLOAK_URL}

COPY package.json package-lock.json /usr/src/app/

RUN npm install

ENV PATH="./node_modules/.bin:$PATH"

COPY .eslintrc *.js ./
COPY src ./src/
COPY public ./public/

RUN npm run build

# ----------------------------------------------------------------------
# Include nginx web server and host the build
# ----------------------------------------------------------------------

FROM nginx:1.19.1-alpine

COPY --from=builder /usr/src/app/build/ /usr/share/nginx/html/
COPY public /usr/share/nginx/html/public/
COPY public/keycloak.json /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

#CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]


