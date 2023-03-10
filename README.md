# MarieGuigou\_\_6_022023

This project is the 6th of the Web Developer course at Openclassrooms.
It is about developing an application to create and evaluate sauces and to allow users to add their favorite sauces and to like or dislike the sauces added by other users.

## Installation

You'll need npm for the API and the front-end

#### Back-end setting-up

git clone https://github.com/MaryG78/MarieGuigou__6_022023.git

Download node.js if you don't have it
https://nodejs.org/en/download/

Install npm in the project folder

```bash
  npm install
  npm init
```

Run the server

```bash
node server
```

or

```bash
npm install nodemon
```

Nodemon monitors for any changes in your source and automatically restart your server.
The server should run on localhost with default port 3000.

#### Front-end setting-up

git clone https://github.com/OpenClassrooms-Student-Center/go-fullstack-v3-fr.git

Install and run npm

```bash
cd frontend
npm install
npm run start
```

Access to the interface at http://localhost:4200

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URI`="**\*\*\***"

`PASSPHRASE`="**\*\*\***"

`IV`="**\*\*\***"

`CLIENT_ENDPOINT`='http://127.0.0.1:8081' >> don't change this value

## API Reference

| Function     | Method   | Route                  | Type             |
| :----------- | :------- | :--------------------- | :--------------- |
| Signup       | `POST`   | `/api/auth/signup`     | `string`         |
| Login        | `POST`   | `/api/auth/login`      | `string`         |
| Get all      | `GET`    | `/api/sauces`          | `Array - string` |
| Get one      | `GET`    | `/api/sauces/:id`      | `string`         |
| Create       | `POST`   | `/api/sauces`          | `string - file`  |
| Modify       | `PUT`    | `/api/sauces/:id`      | `string - file`  |
| Delete       | `DELETE` | `/api/sauces/:id`      | `-`              |
| Like/dislike | `POST`   | `/api/sauces/:id/like` | `String-Number`  |
