<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>
<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
  <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
Description
Euro-Bridge API is an internship project designed to streamline the process of finding internships in Europe. This platform allows internship seekers to submit their CVs in PDF format and facilitates real-time communication between them and recruiters. It is built using the NestJS framework and leverages various technologies to ensure efficient and scalable functionality for both internship seekers and companies.

Features
CV Submission: Users can upload their CVs in PDF format.
Real-time Communication: Seamless chat functionality for direct interaction between internship seekers and recruiters.
Efficient Matching: Optimized for fast and effective matching between candidates and companies.
Installation
To get started with the project, clone the repository and install the dependencies:

bash
Copy code
$ npm install
Running the App
You can run the application in different modes:

bash
Copy code
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
Testing
Run the tests using the following commands:

bash
Copy code
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
Database
The application uses MySQL as its primary database, managed through TypeORM. Redis is used for caching to enhance performance and scalability.

Support
NestJS is an MIT-licensed open source project. It thrives thanks to the support of its sponsors and backers. To support the project, please visit this page.

Stay in Touch
Author - Kamil Myśliwiec
Website - https://nestjs.com
Twitter - @nestframework
License
This project is UNLICENSED.

Remarks
Please note that UseGuards were temporarily removed to simplify testing. They may be reintroduced in future updates to enhance security and access control.

