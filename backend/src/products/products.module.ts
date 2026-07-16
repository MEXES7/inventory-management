import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StockLogsModule } from '../stock-logs/stock-logs.module';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  imports: [PrismaModule, StockLogsModule, InventoryModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
