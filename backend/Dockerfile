# Use official Node.js 20 image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files first and install dependencies
COPY package*.json tsconfig.json ./
RUN npm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose backend port
EXPOSE 4000

# Run the compiled app
CMD ["npm", "start"]
