FROM arm64v8/node:6.15.1-stretch

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
#RUN npm install
COPY . /usr/src/app
CMD [ "node", "./bin/www" ]