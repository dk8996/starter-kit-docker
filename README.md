# Starter Kit with Docker
Starter Kit for Truffle, Ganache, React enable via Docker.

Inspired by [Master Blockchain Step-By-Step](https://www.youtube.com/watch?v=sCE-fQJAVQ4) from Dapp University.

## Intro
There are two dockerfiles, one for the truffle development tools and React, and another for ganache-cli. We will use the docker compose file to start and stop the two containers.

## ganache-cli
We simply start a new instace of Ganache cli in the Dockerfile. We set the port to 57771. [Dockerfile](/docker/ganache-cli/Dockerfile)

## truffle
We create an image based on Ubuntu, installing node and npm. Then installing truffle suite. [Dockerfile](/docker/truffle-suite/Dockerfile)

## Running images
We will use the `docker-compose up` from the root directory to get it up and running using the [docker-compose.yml](/docker-compose.yml)



