FROM mcr.microsoft.com/playwright:v1.24.0-jammy
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY dist ./dist
CMD ["node", "/app/dist/index.js"]