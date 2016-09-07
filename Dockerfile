FROM node:wheezy
MAINTAINER Ferran Vila ferran.vila.conesa@gmail.com

# Container properties
WORKDIR /src
EXPOSE 3000

# Copy app to /src
COPY . /src

# Install app and dependencies into /src
RUN npm install

# Run the app
CMD ["npm", "start"]
