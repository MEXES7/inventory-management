import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockReason } from '@prisma/client';
import { QueryStockLogsDto } from './dto/query-stock-log.dto';

@Injectable()
export class StockLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(
    productId: string,
    changeAmount: number,
    reason: StockReason,
  ) {
    return this.prisma.stockLog.create({
      data: {
        productId,
        changeAmount,
        reason,
      },
    });
  }

  async findAll(query: QueryStockLogsDto) {
    const { page, limit } = query;

    const skip = (page - 1) * limit;

    const [logs, total] = await this.prisma.$transaction([
      this.prisma.stockLog.findMany({
        include: {
          product: true,
        },
        skip,
        take: limit,
        orderBy: {
          timestamp: 'desc',
        },
      }),

      this.prisma.stockLog.count(),
    ]);

    return {
      data: logs,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }
}
