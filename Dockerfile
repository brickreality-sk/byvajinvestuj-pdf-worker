# force redeploy

FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

# Copy package files first
COPY package*.json ./

RUN npm ci --only=production

# Copy the rest of the app
COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
