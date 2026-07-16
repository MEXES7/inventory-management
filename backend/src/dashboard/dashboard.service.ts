import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [
      totalProducts,
      totalUnits,
      lowStock,
      inStock,
      outOfStock,
      recentLogs,
    ] = await Promise.all([
      this.prisma.product.count(),

      this.prisma.product.aggregate({
        _sum: {
          quantity: true,
        },
      }),

      this.prisma.product.count({
        where: {
          status: ProductStatus.LOW_STOCK,
        },
      }),

      this.prisma.product.count({
        where: {
          status: ProductStatus.IN_STOCK,
        },
      }),

      this.prisma.product.count({
        where: {
          status: ProductStatus.OUT_OF_STOCK,
        },
      }),

      this.prisma.stockLog.findMany({
        select: {
          id: true,
          changeAmount: true,
          reason: true,
          timestamp: true,
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              quantity: true,
            },
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: 10,
      }),
    ]);

    const products = await this.prisma.product.findMany({
      select: {
        quantity: true,
        price: true,
      },
    });

    const totalInventoryValue = products.reduce((total, product) => {
      return total + Number(product.price) * product.quantity;
    }, 0);

    return {
      totalProducts,
      totalUnits: totalUnits._sum.quantity ?? 0,
      lowStock,
      inStock,
      outOfStock,
      totalInventoryValue,
      recentLogs,
    };
  }
}
