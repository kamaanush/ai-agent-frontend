# ---- Build stage ----
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Run stage ----
FROM nginx:alpine

# Custom nginx config for Angular + OpenShift
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Angular dist folder (confirmed project name)
COPY --from=build /app/dist/ai-agent-frontend /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
