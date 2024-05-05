import { Controller, Get, } from '@nestjs/common';
import { AppService } from './app.service';
// import * as cors from 'cors';

// export const corsOptions = {
//   origin: 'http://localhost:3001/', // Replace with allowed origin(s)
//   credentials: true, // Set to true if sending cookies or authentication headers across origins
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allowed request headers
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // Allowed HTTP methods
// };

// export const corsMiddleware = cors(corsOptions);
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }}
// }export class AppModule implements NestModule {
//   configure(app: any) {
//     app.use(cors(corsOptions));
//   }
// }
