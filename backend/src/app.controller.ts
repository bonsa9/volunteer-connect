import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  @Get()
  getApiRoot() {
    return {
      message: 'Volunteer Connect API is running.',
      endpoints: ['/api/volunteers'],
    };
  }
}
