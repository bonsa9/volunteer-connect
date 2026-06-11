import { IsUUID, IsOptional, IsJSON } from 'class-validator';

export class CreateDistributionReportDto {
  @IsUUID()
  campaignId: string;

  @IsOptional()
  @IsJSON()
  distributionData?: Record<string, unknown>;
}

export class UpdateDistributionReportDto {
  @IsOptional()
  @IsJSON()
  distributionData?: Record<string, unknown>;

  @IsOptional()
  @IsUUID()
  campaignId?: string;
}
