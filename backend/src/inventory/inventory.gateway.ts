import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Product } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class InventoryGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(InventoryGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitInventoryUpdated(product: Product) {
    this.server.emit('product.updated', product);
  }

  emitProductCreated(product: Product) {
    this.server.emit('product.created', product);
  }

  emitProductDeleted(id: string) {
    this.server.emit('product.deleted', { id });
  }

  emitBulkSync(products: Product[]) {
    this.server.emit('inventory.sync.completed', products);
  }
}
