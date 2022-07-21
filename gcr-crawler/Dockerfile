FROM mcr.microsoft.com/playwright:v1.23.4-focal-amd64
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY dist ./dist
CMD ["node", "/app/dist/index.js"]