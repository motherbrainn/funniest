FROM node:18 AS server-build
WORKDIR /usr/src/app
ENV NODE_ENV='production'
COPY / ./
RUN npm install

CMD ["node", "./index.js"]