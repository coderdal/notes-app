FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]