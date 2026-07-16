import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SyncProductsDto } from './dto/sync-products.dto';
import { QueryProductsDto } from './dto/query-products.dto/query-products.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Create a new product',
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully.',
  })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiOperation({
    summary: 'Bulk synchronize inventory',
  })
  @Post('sync')
  sync(@Body() dto: SyncProductsDto) {
    return this.productsService.sync(dto);
  }

  @ApiOperation({
    summary: 'Retrieve all products',
  })
  @Get()
  findAll(@Query() query: QueryProductsDto) {
    return this.productsService.findAll(query);
  }

  @Get('for-sync')
  findAllForSync() {
    return this.productsService.findAllForSync();
  }

  @ApiOperation({
    summary: 'Retrieve a product by ID',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update a product',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @ApiOperation({
    summary: 'Delete a product',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
