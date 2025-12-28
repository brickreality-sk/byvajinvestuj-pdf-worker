# Playwright image – MUSÍ sedieť s verziou v package.json
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

# Najprv package súbory (kvôli cache)
COPY package.json package-lock.json ./

# Nainštaluj presne locknuté dependencies
RUN npm ci --omit=dev

# Skopíruj zvyšok aplikácie
COPY . .

# Railway ti pustí app na tomto porte
EXPOSE 8080

# Spustenie servera
CMD ["node", "server.js"]
