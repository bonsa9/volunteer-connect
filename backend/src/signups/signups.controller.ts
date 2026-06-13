import { Controller, Get, Query, Param, Post, Body, Put, NotFoundException, Delete, ValidationPipe } from '@nestjs/common';
import { SignupsService } from './signups.service';
import { CreateSignupDto, UpdateSignupDto, MarkAttendanceDto } from './signups.dto';

@Controller('api/signups')
export class SignupsController {
  constructor(private readonly signupsService: SignupsService) {}

  @Get()
  findAll(
    @Query()
    query: { page?: string; limit?: string; volunteerId?: string; opportunityId?: string; confirmed?: string },
  ) {
    return this.signupsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const signup = await this.signupsService.findOne(id);
    if (!signup) throw new NotFoundException();
    return signup;
  }

  @Post()
  create(@Body(new ValidationPipe()) body: CreateSignupDto) {
    return this.signupsService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) body: UpdateSignupDto) {
    const updated = await this.signupsService.update(id, body);
    if (!updated) throw new NotFoundException();
    return updated;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.signupsService.remove(id);
  }

  @Post(':id/attendance')
  async markAttendance(
    @Param('id') id: string,
    @Body(new ValidationPipe()) body: MarkAttendanceDto,
  ) {
    const result = await this.signupsService.markAttendance(id, body.attended, body.hoursLogged);
    return result;
  }

  @Get(':id/certificate')
  async getCertificate(@Param('id') id: string) {
    return this.signupsService.getCertificateData(id);
  }
}
