FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./

RUN npm ci

COPY backend/ .

EXPOSE 5000

CMD ["node", "index.js"]
