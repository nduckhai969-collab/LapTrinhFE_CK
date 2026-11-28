import { ACTION } from '../constants/socket.constants';
import type { SocketEvent } from '../constants/socket.constants';
import type { SocketEnvelope, SocketResponse } from '../types/socket.types';

const SOCKET_URL = import.meta.env.VITE_WS_URL;
const REQUEST_TIMEOUT_MS = 15000;

interface PendingRequest {
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
  timeoutId: number;
}

let socket: WebSocket | null = null;
let connectionPromise: Promise<void> | null = null;
const pendingRequests = new Map<SocketEvent, PendingRequest[]>();
const messageListeners = new Set<(response: SocketResponse) => void>();
const closeListeners = new Set<() => void>();

const removePendingRequest = (event: SocketEvent, request: PendingRequest): void => {
  const queue = pendingRequests.get(event);
  if (queue === undefined) {
    return;
  }
  const index = queue.indexOf(request);
  if (index !== -1) {
    queue.splice(index, 1);
  }
  if (queue.length === 0) {
    pendingRequests.delete(event);
  }
};

export const connectSocket = async (): Promise<void> => {
  if (socket?.readyState === WebSocket.OPEN) {
    return;
  }
  if (connectionPromise !== null) {
    return connectionPromise;
  }

  const nextSocket = new WebSocket(SOCKET_URL);
  socket = nextSocket;
  connectionPromise = new Promise<void>((resolve, reject) => {
    nextSocket.onopen = () => resolve();
    nextSocket.onerror = () => reject(new Error('Không thể kết nối máy chủ chat.'));
    nextSocket.onclose = () => {
      const isActiveSocket = socket === nextSocket;
      if (isActiveSocket) {
        socket = null;
      }
      pendingRequests.forEach((queue) => {
        queue.forEach((request) => {
          window.clearTimeout(request.timeoutId);
          request.reject(new Error('Kết nối tới máy chủ chat đã bị đóng.'));
        });
      });
      pendingRequests.clear();
      if (isActiveSocket) {
        closeListeners.forEach((listener) => listener());
      }
    };
    nextSocket.onmessage = (message) => {
      let response: SocketResponse;
      try {
        response = JSON.parse(String(message.data)) as SocketResponse;
      } catch {
        return;
      }

      messageListeners.forEach((listener) => listener(response));

      const queue = pendingRequests.get(response.event);
      const request = queue?.shift();
      if (queue !== undefined && queue.length === 0) {
        pendingRequests.delete(response.event);
      }
      if (request === undefined) {
        return;
      }
      window.clearTimeout(request.timeoutId);
      if (response.status === 'success') {
        request.resolve(response.data);
      } else {
        request.reject(new Error(response.mes ?? `Yêu cầu ${response.event} thất bại.`));
      }
    };
  });

  const activeConnection = connectionPromise;
  try {
    await activeConnection;
  } finally {
    if (connectionPromise === activeConnection) {
      connectionPromise = null;
    }
  }
};

export const sendSocket = async <T>(
  event: SocketEvent,
  data?: Record<string, unknown>,
): Promise<T> => {
  await connectSocket();
  if (socket === null || socket.readyState !== WebSocket.OPEN) {
    throw new Error('Kết nối tới máy chủ chat chưa sẵn sàng.');
  }

  const payload: SocketEnvelope = data === undefined
    ? { action: ACTION, data: { event } }
    : { action: ACTION, data: { event, data } };

  let resolveRequest!: (value: T) => void;
  let rejectRequest!: (reason: Error) => void;
  const requestPromise = new Promise<T>((resolve, reject) => {
    resolveRequest = resolve;
    rejectRequest = reject;
  });

  const pending: PendingRequest = {
    resolve: (value) => resolveRequest(value as T),
    reject: rejectRequest,
    timeoutId: 0,
  };
  pending.timeoutId = window.setTimeout(() => {
    removePendingRequest(event, pending);
    rejectRequest(new Error(`Máy chủ không phản hồi yêu cầu ${event}.`));
  }, REQUEST_TIMEOUT_MS);

  const queue = pendingRequests.get(event);
  if (queue === undefined) {
    pendingRequests.set(event, [pending]);
  } else {
    queue.push(pending);
  }

  try {
    socket.send(JSON.stringify(payload));
  } catch {
    window.clearTimeout(pending.timeoutId);
    removePendingRequest(event, pending);
    rejectRequest(new Error('Không gửi được yêu cầu tới máy chủ chat.'));
  }

  return requestPromise;
};

export const isSocketOpen = (): boolean => socket?.readyState === WebSocket.OPEN;

export const closeSocket = (): void => {
  socket?.close();
  socket = null;
};

export const onSocketMessage = (
  listener: (response: SocketResponse) => void,
): (() => void) => {
  messageListeners.add(listener);
  return () => {
    messageListeners.delete(listener);
  };
};

export const onSocketClose = (listener: () => void): (() => void) => {
  closeListeners.add(listener);
  return () => {
    closeListeners.delete(listener);
  };
};
