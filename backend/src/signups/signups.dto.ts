import { IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreateSignupDto {
  @IsUUID()
  volunteerId: string;

  @IsUUID()
  opportunityId: string;

  @IsOptional()
  @IsBoolean()
  confirmed?: boolean;
}

export class UpdateSignupDto {
  @IsOptional()
  @IsBoolean()
  confirmed?: boolean;

  @IsOptional()
  @IsUUID()
  volunteerId?: string;

  @IsOptional()
  @IsUUID()
  opportunityId?: string;
}

import { IsNumber } from 'class-validator';

export class MarkAttendanceDto {
  @IsBoolean()
  attended: boolean;

  @IsNumber()
  hoursLogged: number;
}
