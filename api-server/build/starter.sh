#!/bin/sh
# npm install
forever stopall
NODE_ENV=production PORT=8080 forever start bin/www
NODE_ENV=development PORT=8081 forever start bin/www
forever start proxy.js
forever list