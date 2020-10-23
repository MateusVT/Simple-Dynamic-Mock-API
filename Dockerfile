FROM node:12.13-slim
WORKDIR /usr/app
COPY . .
RUN npm install
EXPOSE 8000
CMD ["npm", "start"]