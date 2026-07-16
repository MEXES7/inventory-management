import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const prismaMock = {
    product: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn(), // <-- add this
    },
    stockLog: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return dashboard statistics', async () => {
    prismaMock.product.count
      .mockResolvedValueOnce(5) // totalProducts
      .mockResolvedValueOnce(2) // lowStock
      .mockResolvedValueOnce(1); // outOfStock

    prismaMock.product.aggregate.mockResolvedValue({
      _sum: {
        quantity: 120,
      },
    });

    prismaMock.stockLog.findMany.mockResolvedValue([
      {
        id: '1',
        changeAmount: 10,
        reason: 'RESTOCK',
        timestamp: new Date(),
        product: {
          id: '1',
          name: 'Laptop',
          sku: 'SKU001',
          quantity: 20,
        },
      },
    ]);

    prismaMock.product.findMany.mockResolvedValue([
      {
        quantity: 20,
        price: 5000,
      },
      {
        quantity: 10,
        price: 15000,
      },
    ]);

    const result = await service.getDashboard();

    expect(result).toEqual({
      totalProducts: 5,
      totalUnits: 120,
      lowStock: 2,
      outOfStock: 1,
      totalInventoryValue: 250000,
      recentLogs: expect.any(Array),
    });
  });

  it('should return zeros when there are no products', async () => {
    prismaMock.product.count
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);

    prismaMock.product.aggregate.mockResolvedValue({
      _sum: {
        quantity: null,
      },
    });

    prismaMock.product.findMany.mockResolvedValue([]);

    prismaMock.stockLog.findMany.mockResolvedValue([]);

    const result = await service.getDashboard();

    expect(result).toEqual({
      totalProducts: 0,
      totalUnits: 0,
      lowStock: 0,
      outOfStock: 0,
      totalInventoryValue: 0,
      recentLogs: [],
    });
  });
});
