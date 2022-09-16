FROM node:16.17.0-alpine3.16

RUN apk --no-cache add --virtual builds-deps build-base python3
WORKDIR /app
COPY . /app/

RUN npm install && npm run build

EXPOSE 3000

CMD npm run start:prod
