@echo off
cd %~dp0
start node ./server/centralAuthority.js
cd ./WebClient
start python -m http.server 8000
cd ..