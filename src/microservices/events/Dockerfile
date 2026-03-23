FROM node:25-alpine AS build

WORKDIR /app

COPY package.json package-lock.json tsconfig.json /app/
COPY src /app/src/

RUN npm ci && npm run build

FROM node:25-alpine

WORKDIR /app

COPY --from=build /app/package.json /app/
COPY --from=build /app/dist /app/dist/

RUN npm i --omit=dev

EXPOSE 8080

ENTRYPOINT ["npm", "run", "start"]
