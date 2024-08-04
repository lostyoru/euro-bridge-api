FROM node:21.2.0

WORKDIR /euro-bridge-api

COPY package*.json ./

RUN npm install

CMD ["npm", "start"]

COPY . .

ENV DB_HOST=localhost \
    PORT=3306 \
    DB_USER=root \
    DB_PASSWORD=shinBAYA2002@ \
    DB_NAME=euro-bridge \
    CLOUDINARY_NAME=dekmr7qlp \
    CLOUDINARY_API_KEY=267191678343465 \
    CLOUDINARY_API_SECRET=ow2JZ6T8ZQeAABApxxJKeJPBCJY

EXPOSE 3301