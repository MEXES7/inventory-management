import { Module } from '@nestjs/common';
import { StockLogsService } from './stock-logs.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StockLogsController } from './stock-logs.controller';

@Module({
  imports: [PrismaModule],
  controllers: [StockLogsController],
  providers: [StockLogsService],
  exports: [StockLogsService],
})
export class StockLogsModule {}
