FROM node:16.17.0-alpine3.16 AS compiler
ENV NODE_OPTIONS=--max_old_space_size=4096
WORKDIR /app
COPY . /app/
RUN npm install && npm run build

FROM nginx:1.22.0-alpine
RUN sed -i '/index.html/i try_files $uri $uri\/ \/index.html;' /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html && mkdir /usr/share/nginx/html
COPY --from=compiler /app/build /usr/share/nginx/html

EXPOSE 80

CMD nginx -g "daemon off;"
