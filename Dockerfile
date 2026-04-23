FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY tsconfig*.json angular.json tailwind.config.js postcss.config.js ./
COPY src ./src

RUN npm run build


FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/dist/task-management-frontend/browser /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

ENV PORT=80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
