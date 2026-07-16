import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, IsNumber, IsPositive } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'IPHONE-001',
    description: 'Unique product SKU',
  })
  @IsString()
  sku!: string;

  @ApiProperty({
    example: 'iPhone 16 Pro',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 25,
  })
  @IsInt()
  @Min(0)
  quantity!: number;

  @ApiProperty({
    example: 1200,
  })
  @IsNumber()
  @IsPositive()
  price!: number;
}
