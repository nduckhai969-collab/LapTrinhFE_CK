import {
  ACTION,
  SOCKET_EVENTS,
  SOCKET_RESPONSE_EVENT_ALIASES,
} from '../constants/socket.constants';
import type { SocketEvent } from '../constants/socket.constants';
import type { SocketEnvelope, SocketResponse } from '../types/socket.types';

const SOCKET_URL = import.meta.env.VITE_WS_URL;
const REQUEST_TIMEOUT_MS = 15000;

interface PendingRequest {
  promise: Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
  timeoutId: number;
}

let socket: WebSocket | null = null;
let connectionPromise: Promise<void> | null = null;
const pendingRequests = new Map<string, PendingRequest>();
const messageListeners = new Set<(response: SocketResponse) => void>();
const closeListeners = new Set<() => void>();

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
      pendingRequests.forEach((request) => {
        window.clearTimeout(request.timeoutId);
        request.reject(new Error('Kết nối tới máy chủ chat đã bị đóng.'));
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

      let requestEvent = response.event;
      let request = pendingRequests.get(requestEvent);

      if (request === undefined) {
        const matchingAlias = Object.entries(SOCKET_RESPONSE_EVENT_ALIASES).find(
          ([, responseEvent]) => responseEvent === response.event,
        );

        if (matchingAlias !== undefined) {
          requestEvent = matchingAlias[0];
          request = pendingRequests.get(requestEvent);
        }
      }

      if (request === undefined) {
        return;
      }
      window.clearTimeout(request.timeoutId);
      pendingRequests.delete(requestEvent);
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
  const existingRequest = pendingRequests.get(event);
  if (existingRequest !== undefined) {
    if (event === SOCKET_EVENTS.GET_USER_LIST || event === SOCKET_EVENTS.RE_LOGIN) {
      return existingRequest.promise as Promise<T>;
    }
    throw new Error(`Yêu cầu ${event} đang được xử lý.`);
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
  const timeoutId = window.setTimeout(() => {
    if (pendingRequests.get(event)?.promise === requestPromise) {
      pendingRequests.delete(event);
    }
    rejectRequest(new Error(`Máy chủ không phản hồi yêu cầu ${event}.`));
  }, REQUEST_TIMEOUT_MS);

  pendingRequests.set(event, {
    promise: requestPromise,
    resolve: (value) => resolveRequest(value as T),
    reject: rejectRequest,
    timeoutId,
  });

  try {
    socket.send(JSON.stringify(payload));
  } catch {
    window.clearTimeout(timeoutId);
    pendingRequests.delete(event);
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
