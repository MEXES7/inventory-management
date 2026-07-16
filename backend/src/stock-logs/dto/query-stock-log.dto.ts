import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class QueryStockLogsDto {
  @IsOptional()
  @Transform(({ value }: { value: string }) => Number(value))
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Transform(({ value }: { value: string }) => Number(value))
  @IsInt()
  @Min(1)
  limit = 10;
}
