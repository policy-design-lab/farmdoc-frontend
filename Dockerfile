# ----------------------------------------------------------------------
# Build application using node
# ----------------------------------------------------------------------

FROM node:14.5.0-alpine AS builder

WORKDIR /usr/src/app

# env to use from app.config (development or production)
#ARG DEPLOY_ENV="development"
#ENV DEPLOY_ENV="development"

ENV NODE_ENV="development"

COPY package.json package-lock.json /usr/src/app/
COPY tools ./tools/

RUN npm install

ENV PATH="./node_modules/.bin:$PATH"

COPY .babelrc .eslintrc *.js ./
COPY src ./src/

RUN npm run build

# ----------------------------------------------------------------------
# Include nginx web server and host the build
# ----------------------------------------------------------------------

FROM nginx:1.19.1-alpine

COPY --from=builder /usr/src/app/dist/ /usr/share/nginx/html/
COPY src/public /usr/share/nginx/html/public/
COPY src/keycloak.json /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

#CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
#COPY --from=builder /opt/web/build /usr/share/nginx/html

