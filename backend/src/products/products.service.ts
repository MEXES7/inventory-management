import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ProductStatus, StockReason } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StockLogsService } from '../stock-logs/stock-logs.service';
import { SyncProductsDto } from './dto/sync-products.dto';
import { InventoryGateway } from '../inventory/inventory.gateway';
import { QueryProductsDto } from './dto/query-products.dto/query-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stockLogsService: StockLogsService,
    private readonly inventoryGateway: InventoryGateway,
  ) {}
  private getStatus(quantity: number): ProductStatus {
    if (quantity === 0) return ProductStatus.OUT_OF_STOCK;
    if (quantity < 10) return ProductStatus.LOW_STOCK;
    return ProductStatus.IN_STOCK;
  }

  async create(dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        ...dto,
        status: this.getStatus(dto.quantity),
      },
    });

    await this.stockLogsService.createLog(
      product.id,
      product.quantity,
      StockReason.RESTOCK,
    );

    this.inventoryGateway.emitProductCreated(product);

    return product;
  }

  async sync(dto: SyncProductsDto) {
    const updatedProducts = await this.prisma.$transaction(async (tx) => {
      const skus = dto.products.map((product) => product.sku);

      const existingProducts = await tx.product.findMany({
        where: {
          sku: {
            in: skus,
          },
        },
      });

      const productMap = new Map(
        existingProducts.map((product) => [product.sku, product]),
      );

      for (const item of dto.products) {
        if (!productMap.has(item.sku)) {
          throw new NotFoundException(
            `Product with SKU '${item.sku}' not found`,
          );
        }
      }

      const operations: Prisma.PrismaPromise<unknown>[] = [];

      for (const item of dto.products) {
        const product = productMap.get(item.sku)!;

        const changeAmount = item.quantity - product.quantity;

        operations.push(
          tx.product.update({
            where: {
              sku: item.sku,
            },
            data: {
              quantity: item.quantity,
              status: this.getStatus(item.quantity),
            },
          }),
        );

        if (changeAmount !== 0) {
          operations.push(
            tx.stockLog.create({
              data: {
                productId: product.id,
                changeAmount,
                reason:
                  changeAmount > 0 ? StockReason.RESTOCK : StockReason.SALE,
              },
            }),
          );
        }
      }

      await Promise.all(operations);

      // Return updated products
      return tx.product.findMany({
        where: {
          sku: {
            in: skus,
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
    });
    this.inventoryGateway.emitBulkSync(updatedProducts);

    return updatedProducts;
  }

  async findAll(query: QueryProductsDto) {
    const { page, limit, search, status } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    const normalizedSearch = search?.trim();

    if (normalizedSearch) {
      where.OR = [
        {
          name: {
            contains: normalizedSearch,
            mode: 'insensitive',
          },
        },
        {
          sku: {
            contains: normalizedSearch,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.product.count({
        where,
      }),
    ]);

    return {
      data: products,
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

  async findAllForSync() {
    return this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        quantity: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const existingProduct = await this.findOne(id);

    const data = {
      ...dto,
      ...(dto.quantity !== undefined && {
        status: this.getStatus(dto.quantity),
      }),
    };

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data,
    });

    if (
      dto.quantity !== undefined &&
      dto.quantity !== existingProduct.quantity
    ) {
      const changeAmount = dto.quantity - existingProduct.quantity;

      await this.stockLogsService.createLog(
        id,
        changeAmount,
        changeAmount > 0 ? StockReason.RESTOCK : StockReason.SALE,
      );
    }

    this.inventoryGateway.emitInventoryUpdated(updatedProduct);

    return updatedProduct;
  }
  async remove(id: string) {
    await this.prisma.product.delete({
      where: { id },
    });

    this.inventoryGateway.emitProductDeleted(id);

    return {
      message: 'Product deleted successfully',
    };
  }
}
