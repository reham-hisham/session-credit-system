import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string | object {
    try {
      return this.appService.getHello();
    } catch (error) {
      console.error('AppController getHello error:', error);
      return {
        status: error.statusCode || 500,
        code: error.code || 'GET_HELLO_ERROR',
        message:
          error.message || 'An error occurred while getting hello message',
      };
    }
  }
}
