import { IsUUID, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateContributionDto {
  @IsUUID()
  volunteerId: string;

  @IsUUID()
  opportunityId: string;

  @IsNumber()
  hours: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateContributionDto {
  @IsOptional()
  @IsNumber()
  hours?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  volunteerId?: string;

  @IsOptional()
  @IsUUID()
  opportunityId?: string;
}
