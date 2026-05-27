import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('Notifications WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // ─── Emit events ──────────────────────────────────────────────────

  emitNotificationCreated(notification: any) {
    this.server.emit('notification.created', notification);
    this.logger.debug(`Emitted notification.created: ${notification?.id || notification?._id}`);
  }

  emitNotificationRead(notificationId: string) {
    this.server.emit('notification.read', { id: notificationId });
    this.logger.debug(`Emitted notification.read: ${notificationId}`);
  }

  emitAllNotificationsRead() {
    this.server.emit('notification.readAll', {});
    this.logger.debug('Emitted notification.readAll');
  }

  emitNotificationDeleted(notificationId: string) {
    this.server.emit('notification.deleted', { id: notificationId });
    this.logger.debug(`Emitted notification.deleted: ${notificationId}`);
  }

  // ─── Job events ──────────────────────────────────────────────────────

  emitJobViewsUpdated(jobId: string, views: number) {
    this.server.emit('job.viewsUpdated', { jobId, views });
    this.logger.debug(`Emitted job.viewsUpdated: ${jobId} → ${views}`);
  }

  emitJobApplicationsUpdated(jobId: string, applied: number) {
    this.server.emit('job.applicationsUpdated', { jobId, applied });
    this.logger.debug(`Emitted job.applicationsUpdated: ${jobId} → ${applied}`);
  }

  /**
   * Emit event to notify admin dashboard to refresh data (e.g. new user registration)
   */
  emitDashboardUpdateNeeded() {
    this.server.emit('dashboard.updateNeeded', { timestamp: new Date().toISOString() });
    this.logger.debug('Emitted dashboard.updateNeeded');
  }
}
