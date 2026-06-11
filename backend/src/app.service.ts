import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcomeMessage() {
    return {
      message: 'Volunteer Connect backend is running.',
      documentation: 'Browse /api/volunteers to see volunteer data.',
    };
  }
}
