FROM node:17

# Install Truffle
RUN npm install -g truffle@5.4.29
RUN truffle version

# Move Contract Files
COPY migrations ./workspace/migrations
COPY truffle-config.js ./workspace/truffle-config.js

# Move React Files
COPY src ./workspace/src
COPY public ./workspace/public
COPY test ./workspace/test
COPY package.json ./workspace/package.json
COPY config-overrides.js ./workspace/config-overrides.js

# Clean Install NPM Dependencies
WORKDIR ./workspace
RUN npm i
