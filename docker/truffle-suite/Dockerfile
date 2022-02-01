FROM ubuntu:latest
USER root
WORKDIR /home/app
RUN apt-get update 
RUN apt-get install -y --no-install-recommends apt-utils
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN apt-get -y install nodejs
RUN npm init -y
RUN npm install -g npm@latest
RUN npm install -g truffle@5.3.4


