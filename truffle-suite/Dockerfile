FROM node:17

# Install Node extensions
RUN npm install -g node-gyp
RUN npm install -g node-gyp-build

# Install Truffle
RUN npm install -g truffle@5.4.29
RUN npm config set bin-links false
RUN truffle version

# Move Contract Files
COPY migrations ./workspace/migrations
COPY truffle-config.js ./workspace/truffle-config.js

# Move React Files
COPY src ./workspace/src
COPY public ./workspace/public
COPY package.json ./workspace/package.json

# Clean Install NPM Dependencies
WORKDIR ./workspace
RUN node -v
RUN npm i
