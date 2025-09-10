# Use official Node.js LTS image
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript
RUN npm run build

# Expose the port
EXPOSE 4000

# Run the app
CMD ["npm", "start"]
