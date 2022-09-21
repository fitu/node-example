FROM node:18-alpine3.15

# Create app's dir
RUN mkdir -p /nodeexample

# Use app's dir as working dir
WORKDIR /nodeexample

# Copy and install dependencies
COPY ./src/users/package*.json /nodeexample/
RUN npm install

# Move all the app's code to the working dir
COPY ./src/users/ /nodeexample/

# Move secrets
RUN mkdir -p /nodeexample/secrets
COPY ./secrets/.env /nodeexample/secrets/

# Compile the app
RUN npm run build

# Create and change permissions for logs
RUN mkdir -p /nodeexample/logs
RUN chown node /nodeexample/logs
RUN chown node /nodeexample/logs/*

# Change the user from "root" to "node"
USER node

# Notify recommend port to open, to be accessible from outside the container
ARG DEFAULT_PORT
ENV PORT=${DEFAULT_PORT}
EXPOSE ${PORT}

CMD [ "npm", "run", "start:prod" ]
