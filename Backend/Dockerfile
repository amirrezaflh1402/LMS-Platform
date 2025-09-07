# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json .  

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Command to run the app
CMD ["npm", "start"]
