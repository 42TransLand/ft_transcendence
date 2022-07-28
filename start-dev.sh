#!/bin/bash
export PORT=3001

jobs=
trap 'kill -HUP $jobs' INT TERM HUP
    cd ./front-end && npm start & jobs="$jobs $!"
    cd ./back-end && npm run start:dev & jobs="$jobs $!"
wait
