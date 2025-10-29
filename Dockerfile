FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./

# Debug: print the package.json that will be used by npm during build.
# This helps identify merge markers or invalid JSON inside the container.
RUN echo '--- BEGIN /app/package.json ---' && cat package.json || true && echo '--- END /app/package.json ---'

RUN npm install --production

COPY backend/ .

EXPOSE 5000

CMD ["node", "index.js"]
