FROM node:18-alpine

WORKDIR /backend

COPY package.json /backend

RUN npm install

COPY . .

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["node", "server.js"]
