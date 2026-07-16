import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StockLogsService } from './stock-logs.service';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryStockLogsDto } from './dto/query-stock-log.dto';

@ApiTags('Stock Logs')
@Controller('stock-logs')
export class StockLogsController {
  constructor(private readonly stockLogsService: StockLogsService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve stock logs data',
  })
  findAll(@Query() query: QueryStockLogsDto) {
    return this.stockLogsService.findAll(query);
  }
}
