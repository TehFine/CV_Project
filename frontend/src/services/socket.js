import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socket = null;

/**
 * Initialize socket connection (singleton)
 */
export function getSocket() {
  if (!socket) {
    socket = io(`${SOCKET_URL}/notifications`, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

/**
 * Connect to socket server
 */
export function connectSocket() {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
}

/**
 * Disconnect socket
 */
export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
  }
}

/**
 * Listen for notification created events
 */
export function onNotificationCreated(callback) {
  const s = getSocket();
  s.on('notification.created', callback);
  return () => s.off('notification.created', callback);
}

/**
 * Listen for notification read events
 */
export function onNotificationRead(callback) {
  const s = getSocket();
  s.on('notification.read', callback);
  return () => s.off('notification.read', callback);
}

/**
 * Listen for all notifications read events
 */
export function onAllNotificationsRead(callback) {
  const s = getSocket();
  s.on('notification.readAll', callback);
  return () => s.off('notification.readAll', callback);
}

/**
 * Listen for notification deleted events
 */
export function onNotificationDeleted(callback) {
  const s = getSocket();
  s.on('notification.deleted', callback);
  return () => s.off('notification.deleted', callback);
}

/**
 * Listen for connection events
 */
export function onConnect(callback) {
  const s = getSocket();
  s.on('connect', callback);
  return () => s.off('connect', callback);
}

export function onDisconnect(callback) {
  const s = getSocket();
  s.on('disconnect', callback);
  return () => s.off('disconnect', callback);
}

/**
 * Listen for job views updated events
 */
export function onJobViewsUpdated(callback) {
  const s = getSocket();
  s.on('job.viewsUpdated', callback);
  return () => s.off('job.viewsUpdated', callback);
}

/**
 * Listen for job applications updated events
 */
export function onJobApplicationsUpdated(callback) {
  const s = getSocket();
  s.on('job.applicationsUpdated', callback);
  return () => s.off('job.applicationsUpdated', callback);
}

/**
 * Listen for dashboard update needed events (e.g. new user registration)
 */
export function onDashboardUpdateNeeded(callback) {
  const s = getSocket();
  s.on('dashboard.updateNeeded', callback);
  return () => s.off('dashboard.updateNeeded', callback);
}

