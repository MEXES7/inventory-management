import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { StockLogsModule } from './stock-logs/stock-logs.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { InventoryGateway } from './inventory/inventory.gateway';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    StockLogsModule,
    DashboardModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, InventoryGateway],
})
export class AppModule {}
