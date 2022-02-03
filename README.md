# Starter Kit with Docker
Starter Kit for Truffle, Ganache, React enable via Docker.

Inspired by [Master Blockchain Step-By-Step](https://www.youtube.com/watch?v=sCE-fQJAVQ4) from Dapp University.

## Intro
There are two dockerfiles, one for the truffle development tools and React, and another for ganache-cli. We will use the docker compose file to start and stop the two containers.

## ganache-cli
We simply start a new instace of Ganache cli in the Dockerfile. We set the port to 8545. [Dockerfile](/ganache-cli/Dockerfile)

## truffle
We create an image based on Ubuntu, installing node and npm. Then installing truffle suite. [Dockerfile](/truffle-suite/Dockerfile)

## Getting Started
1. We will use the `docker-compose up` from the root directory to get it up and running using the [docker-compose.yml](/docker-compose.yml). This will create the stack with two Docker containers, One is Ganache and the other one will be Truffle + React.

2. All the src code will be copied over to the Truffle container see the [Dockerfile](/truffle-suite/Dockerfile). 

3. You can now connect to the the Truffle container using this command `docker exec -it truffle-suite bash`.

4. Make sure your in the `workspace` directory inside your Truffle container. From there you can run `truffle version` to make sure everything is installed.


