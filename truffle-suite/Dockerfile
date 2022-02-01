FROM node:10

# Install Truffle
RUN npm install -g truffle
RUN npm config set bin-links false

# Move Contract Files
COPY migrations ./workspace/migrations
COPY truffle-config.js ./workspace/truffle-config.js

# Move React Files
COPY src ./workspace/src
COPY public ./workspace/public
COPY package.json ./workspace/package.json
COPY package-lock.json ./workspace/package-lock.json

# Clean Install NPM Dependencies
RUN cd workspace && npm ci
