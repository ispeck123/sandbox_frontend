# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:12-alpine as build

# Creating app directory
RUN mkdir -p /app

# Set the working directory
WORKDIR /app

# Copying json
COPY package.json /app

# Install all the dependencies
RUN npm install

# Add the source code to app
COPY . /app

# Generate the build of the application
CMD ["npm","run","build"] 

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist/ispeck-va-sandbox /usr/share/nginx/html

# Expose port 80
EXPOSE 80
