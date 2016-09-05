FROM ubuntu:14.04
MAINTAINER Ferran Vila ferran.vila.conesa@gmail.com

# to avoid some problems:
# debconf: unable to initialize frontend: Dialog
ENV DEBIAN_FRONTEND noninteractive

# Install Nodejs...
RUN apt-get update && apt-get install -y nodejs npm

# Container properties
WORKDIR /src
EXPOSE 3000

# Copy app to /src
COPY . /src

# Install app and dependencies into /src
RUN npm install

# Run the app
CMD ["npm", "start"]
