## Build Stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

RUN npm run build

## Production Build
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
