FROM node:lts-alpine

RUN apk --no-cache add --virtual builds-deps build-base python3
WORKDIR /app
COPY . /app/

RUN npm install && npm run build

EXPOSE 3000

CMD npm run start:prod
