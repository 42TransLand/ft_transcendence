#!/bin/bash

jobs=
trap 'kill -HUP $jobs' INT TERM HUP
    cd ./front-end && export PORT=3001 && npm start & jobs="$jobs $!"
    cd ./back-end && npm run start:dev & jobs="$jobs $!"
wait
