import { Controller, Get } from '@nestjs/common';
import { VolunteersService } from './volunteers.service';

@Controller('api/volunteers')
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) {}

  @Get()
  findAll() {
    return this.volunteersService.findAll();
  }
}
