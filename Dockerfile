FROM node:wheezy
MAINTAINER Ferran Vila ferran.vila.conesa@gmail.com

WORKDIR /home/app
EXPOSE 9000

# install global dependencies
RUN npm install -g \
    angular-cli@1.0.0-beta.10 \
    typings@1.3.3 \
    --loglevel warn

# copy the app, install app dependencies and compile it
COPY . /home/app
RUN npm install --loglevel warn
RUN typings install
RUN ng build -prod

CMD ["node", "config/server/app.js"]
