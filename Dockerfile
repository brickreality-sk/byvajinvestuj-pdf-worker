# Use Playwright's official image with all browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy server code
COPY server.js ./

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
