FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

# Fix: Remove brackets and use proper CMD syntax
CMD ["npm", "run", "dev"]