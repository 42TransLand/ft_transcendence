docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker run -d --env-file .env -p 5432:5432 postgres:14-alpine
./start-dev.sh
