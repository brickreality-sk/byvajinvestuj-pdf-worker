FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# Copy package files first
COPY package*.json ./

RUN npm ci --only=production

# Copy the rest of the app
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
