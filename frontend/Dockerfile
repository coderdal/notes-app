FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies for node-gyp
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 