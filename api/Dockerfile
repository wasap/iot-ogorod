# Use the official lightweight Node.js 10 image.
# https://hub.docker.com/_/node
FROM node:20

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
# Copy local code to the container image.
COPY . ./

ENV NODE_ENV=production

# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
# RUN npm ci --only=production
RUN npm install --omit=dev



# Run the web service on container startup.
CMD [ "npm", "start" ]