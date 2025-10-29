FROM node:18-alpine

WORKDIR /app

# Cache-bust: ensure Render runs a fresh build so the debug RUN prints package.json.
# This is harmless and will be removed after diagnosing.
ENV CI_CACHEBUST=66e4b21109aaa9d02db0a85e9e431255b1df3850

COPY backend/package*.json ./

# Debug: print the package.json that will be used by npm during build.
# This helps identify merge markers or invalid JSON inside the container.
# The explicit markers below make it easy to copy/paste from Render logs.
RUN echo "----- BEGIN package.json -----" && cat package.json || true && echo "----- END package.json -----"

RUN npm install --production

COPY backend/ .

EXPOSE 5000

CMD ["node", "index.js"]
