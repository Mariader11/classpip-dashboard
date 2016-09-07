FROM nginx
MAINTAINER Ferran Vila ferran.vila.conesa@gmail.com

WORKDIR /tmp
EXPOSE 80

# Install dependencies
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g angular-cli typings

# Generate build for production
COPY . /tmp
RUN npm install
RUN typings install
RUN ng build -prod
RUN mv /tmp/dist/* /usr/share/nginx/html/

# Cleanup
RUN rm -rf /tmp/* && rm -rf /var/lib/apt/lists/*
