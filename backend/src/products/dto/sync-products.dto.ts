import { IsArray, IsInt, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SyncProductItemDto {
  @IsString()
  sku!: string;

  @IsInt()
  @Min(0)
  quantity!: number;
}

export class SyncProductsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncProductItemDto)
  products!: SyncProductItemDto[];
}
