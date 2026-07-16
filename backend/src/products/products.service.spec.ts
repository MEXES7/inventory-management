import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { StockLogsService } from '../stock-logs/stock-logs.service';
import { InventoryGateway } from '../inventory/inventory.gateway';
import { ProductStatus, StockReason } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;

  const prismaMock = {
    product: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const stockLogsMock = {
    createLog: jest.fn(),
  };

  const gatewayMock = {
    emitProductCreated: jest.fn(),
    emitInventoryUpdated: jest.fn(),
    emitProductDeleted: jest.fn(),
    emitBulkSync: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: StockLogsService,
          useValue: stockLogsMock,
        },
        {
          provide: InventoryGateway,
          useValue: gatewayMock,
        },
      ],
    }).compile();

    service = module.get(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const dto = {
      sku: 'IPHONE-001',
      name: 'iPhone 16',
      quantity: 20,
      price: 1200,
    };

    const product = {
      id: '1',
      ...dto,
      status: ProductStatus.IN_STOCK,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.product.create.mockResolvedValue(product);

    stockLogsMock.createLog.mockResolvedValue(undefined);

    const result = await service.create(dto);

    expect(prismaMock.product.create).toHaveBeenCalled();

    expect(stockLogsMock.createLog).toHaveBeenCalledWith(
      product.id,
      product.quantity,
      StockReason.RESTOCK,
    );

    expect(gatewayMock.emitProductCreated).toHaveBeenCalledWith(product);

    expect(result).toEqual(product);
  });

  it('should set status to OUT_OF_STOCK when quantity is zero', async () => {
    const dto = {
      sku: 'SKU002',
      name: 'Mouse',
      quantity: 0,
      price: 50,
    };

    prismaMock.product.create.mockResolvedValue({
      id: '2',
      ...dto,
      status: ProductStatus.OUT_OF_STOCK,
    });

    stockLogsMock.createLog.mockResolvedValue(undefined);

    await service.create(dto);

    expect(prismaMock.product.create).toHaveBeenCalledWith({
      data: {
        ...dto,
        status: ProductStatus.OUT_OF_STOCK,
      },
    });
  });

  it('should set status to LOW_STOCK when quantity is low', async () => {
    const dto = {
      sku: 'SKU003',
      name: 'Keyboard',
      quantity: 5,
      price: 100,
    };

    prismaMock.product.create.mockResolvedValue({
      id: '3',
      ...dto,
      status: ProductStatus.LOW_STOCK,
    });

    stockLogsMock.createLog.mockResolvedValue(undefined);

    await service.create(dto);

    expect(prismaMock.product.create).toHaveBeenCalledWith({
      data: {
        ...dto,
        status: ProductStatus.LOW_STOCK,
      },
    });
  });

  it('should return a product by id', async () => {
    const product = {
      id: '1',
      sku: 'SKU001',
      name: 'Laptop',
      quantity: 20,
      price: 1500,
      status: ProductStatus.IN_STOCK,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.product.findUnique.mockResolvedValue(product);

    const result = await service.findOne('1');

    expect(prismaMock.product.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });

    expect(result).toEqual(product);
  });

  it('should throw NotFoundException if product does not exist', async () => {
    prismaMock.product.findUnique.mockResolvedValue(null);

    await expect(service.findOne('100')).rejects.toThrow(NotFoundException);

    expect(prismaMock.product.findUnique).toHaveBeenCalledWith({
      where: { id: '100' },
    });
  });

  it('should update a product successfully', async () => {
    const existingProduct = {
      id: '1',
      sku: 'SKU001',
      name: 'Laptop',
      quantity: 20,
      price: 1500,
      status: ProductStatus.IN_STOCK,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updateDto = {
      quantity: 5,
      price: 1600,
    };

    const updatedProduct = {
      ...existingProduct,
      ...updateDto,
      status: ProductStatus.LOW_STOCK,
    };

    prismaMock.product.findUnique.mockResolvedValue(existingProduct);
    prismaMock.product.update.mockResolvedValue(updatedProduct);

    stockLogsMock.createLog.mockResolvedValue(undefined);

    const result = await service.update('1', updateDto);

    expect(prismaMock.product.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: {
        ...updateDto,
        status: ProductStatus.LOW_STOCK,
      },
    });

    expect(stockLogsMock.createLog).toHaveBeenCalled();

    expect(gatewayMock.emitInventoryUpdated).toHaveBeenCalledWith(
      updatedProduct,
    );

    expect(result).toEqual(updatedProduct);
  });

  it('should update product without creating a stock log if quantity is unchanged', async () => {
    const existingProduct = {
      id: '1',
      sku: 'SKU001',
      name: 'Laptop',
      quantity: 20,
      price: 1500,
      status: ProductStatus.IN_STOCK,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updateDto = {
      price: 1800,
    };

    const updatedProduct = {
      ...existingProduct,
      ...updateDto,
    };

    prismaMock.product.findUnique.mockResolvedValue(existingProduct);
    prismaMock.product.update.mockResolvedValue(updatedProduct);

    const result = await service.update('1', updateDto);

    expect(stockLogsMock.createLog).not.toHaveBeenCalled();

    expect(result).toEqual(updatedProduct);
  });

  it('should remove a product', async () => {
    const product = {
      id: '1',
      sku: 'SKU001',
      name: 'Laptop',
      quantity: 20,
      price: 1500,
      status: ProductStatus.IN_STOCK,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.product.findUnique.mockResolvedValue(product);
    prismaMock.product.delete.mockResolvedValue(product);

    const result = await service.remove('1');

    expect(prismaMock.product.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });

    expect(gatewayMock.emitProductDeleted).toHaveBeenCalledWith('1');

    expect(result).toEqual({
      message: 'Product deleted successfully',
    });
  });

  it('should synchronize products', async () => {
    const dto = {
      products: [
        {
          sku: 'SKU001',
          quantity: 30,
        },
      ],
    };

    const existingProduct = {
      id: '1',
      sku: 'SKU001',
      name: 'Laptop',
      quantity: 20,
      price: 1500,
      status: ProductStatus.IN_STOCK,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedProduct = {
      ...existingProduct,
      quantity: 30,
    };

    const tx = {
      product: {
        findMany: jest
          .fn()
          .mockResolvedValueOnce([existingProduct]) // Existing products
          .mockResolvedValueOnce([updatedProduct]), // Return updated products
        update: jest.fn().mockResolvedValue(updatedProduct),
      },
      stockLog: {
        create: jest.fn(),
      },
    };

    prismaMock.$transaction.mockImplementation(async (callback) => {
      return await callback(tx);
    });

    const result = await service.sync(dto);

    expect(tx.product.findMany).toHaveBeenCalledTimes(2);

    expect(tx.product.update).toHaveBeenCalledWith({
      where: {
        sku: 'SKU001',
      },
      data: {
        quantity: 30,
        status: ProductStatus.IN_STOCK,
      },
    });

    expect(tx.stockLog.create).toHaveBeenCalledWith({
      data: {
        productId: '1',
        changeAmount: 10,
        reason: StockReason.RESTOCK,
      },
    });

    expect(gatewayMock.emitBulkSync).toHaveBeenCalledWith([updatedProduct]);

    expect(result).toEqual([updatedProduct]);
  });
});
