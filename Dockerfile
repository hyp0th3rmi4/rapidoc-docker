FROM node:alpine AS builder

WORKDIR /opt/app

# From: https://hub.docker.com/r/jfyne/node-alpine-yarn/dockerfile
# added: git, openssh
 
RUN apk add --no-cache --virtual .build-deps \
    ca-certificates \
    git \
    openssh \
    wget \
    tar && \
    cd /usr/local/bin && \
    wget https://yarnpkg.com/latest.tar.gz && \
    tar zvxf latest.tar.gz && \
    ln -s /usr/local/bin/dist/bin/yarn.js /usr/local/bin/yarn.js && \
    mkdir -p /opt/app && \
    git clone https://github.com/mrin9/RapiDoc.git /opt/app/RapiDoc && \
    apk del .build-deps 
    
RUN cd /opt/app/RapiDoc && \
    yarn install && \
    yarn build 

FROM nginx:1.17.6-alpine AS server

COPY --from=builder /opt/app/RapiDoc/dist /usr/share/nginx/html


FROM server AS portal

RUN mkdir /opt/app/
ADD docker /opt/app
RUN mv /opt/app/html/* /usr/share/nginx/html/ 

ENTRYPOINT [ "/opt/app/boot.sh" ]

ARG commit
LABEL commit=$commit


