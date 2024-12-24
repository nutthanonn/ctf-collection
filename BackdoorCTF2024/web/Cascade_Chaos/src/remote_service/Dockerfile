FROM node:22.8.0

RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    libatk1.0-0 \
    libxkbcommon-x11-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    libxrandr2 \
    libgdk-pixbuf2.0-0 \
    libatk-bridge2.0-0 \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY ./src ./src

RUN mkdir -p /home/node/.cache/puppeteer && \
    chown -R node:node /home/node/.cache/puppeteer && \
    chown -R node:node /app

EXPOSE 4001

USER node
CMD ["node", "src/index.js"]
