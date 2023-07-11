FROM node:lts-alpine
RUN npm i -g pnpm
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "pnpm-lock.yaml*", "npm-shrinkwrap.json*", "./"]
RUN pnpm i --production --silent
COPY . .
EXPOSE 4000
RUN chown -R node /usr/src/app
USER node
CMD ["pnpm", "start"]
