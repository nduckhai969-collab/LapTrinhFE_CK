import type{ CreateRoomPayload,CreateRoomResponse} from "../types";
import type{JoinRoomPayload,JoinRoomResponse} from "../types";

const SOCKET_URL = 'wss://chat.longapp.io.vn/chat/chat';
const SESSION_KEY = 'connectchat_session';

export interface AuthSession {
  username: string;
  reloginCode: string;
}

export interface ChatListEntry {
  name: string;
  type: 0 | 1;
  actionTime: string;
}

interface SocketResponse<T = unknown> {
  status: 'success' | 'error';
  event: string;
  data?: T;
  mes?: string;
}

interface PendingRequest {
  promise: Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
  timeoutId: number;
}

let socket: WebSocket | null = null;
let connectionPromise: Promise<void> | null = null;
let isAuthenticated = false;
const pendingRequests = new Map<string, PendingRequest>();

const readSession = (): AuthSession | null => {
  const value = localStorage.getItem(SESSION_KEY);
  if (value === null) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthSession;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

const saveSession = (session: AuthSession): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const connect = async (): Promise<void> => {
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
      if (socket === nextSocket) {
        socket = null;
        isAuthenticated = false;
      }
      pendingRequests.forEach((request) => {
        window.clearTimeout(request.timeoutId);
        request.reject(new Error('Kết nối tới máy chủ chat đã bị đóng.'));
      });
      pendingRequests.clear();
    };
    nextSocket.onmessage = (message) => {
      let response: SocketResponse;
      try {
        response = JSON.parse(String(message.data)) as SocketResponse;
      } catch {
        return;
      }

      const request = pendingRequests.get(response.event);
      if (request === undefined) {
        return;
      }
      window.clearTimeout(request.timeoutId);
      pendingRequests.delete(response.event);
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

const sendRequest = async <T>(
  event: string,
  data?: Record<string, unknown>,
): Promise<T> => {
  await connect();
  if (socket === null || socket.readyState !== WebSocket.OPEN) {
    throw new Error('Kết nối tới máy chủ chat chưa sẵn sàng.');
  }
  const existingRequest = pendingRequests.get(event);
  if (existingRequest !== undefined) {
    if (event === 'GET_USER_LIST' || event === 'RE_LOGIN') {
      return existingRequest.promise as Promise<T>;
    }
    throw new Error(`Yêu cầu ${event} đang được xử lý.`);
  }

  const payload = data === undefined
    ? { action: 'onchat', data: { event } }
    : { action: 'onchat', data: { event, data } };

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
  }, 15000);

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

export const getAuthSession = (): AuthSession | null => readSession();

export const registerUser = async (
  username: string,
  password: string,
): Promise<{ success: boolean; message: string }> => {
  const message = await sendRequest<string>('REGISTER', { user: username, pass: password });
  return { success: true, message: message ?? 'Đăng ký thành công.' };
};

export const loginUser = async (
  username: string,
  password: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await sendRequest<{ RE_LOGIN_CODE?: string }>('LOGIN', {
    user: username,
    pass: password,
  });
  if (response.RE_LOGIN_CODE === undefined) {
    throw new Error('Máy chủ đăng nhập thành công nhưng không trả mã phiên.');
  }

  saveSession({ username, reloginCode: response.RE_LOGIN_CODE });
  isAuthenticated = true;
  return { success: true, message: 'Đăng nhập thành công.' };
};

const ensureAuthenticated = async (): Promise<void> => {
  if (isAuthenticated && socket?.readyState === WebSocket.OPEN) {
    return;
  }

  const session = readSession();
  if (session === null) {
    throw new Error('Phiên đăng nhập không tồn tại. Vui lòng đăng nhập lại.');
  }

  const response = await sendRequest<{ RE_LOGIN_CODE?: string }>('RE_LOGIN', {
    user: session.username,
    code: session.reloginCode,
  });
  if (response.RE_LOGIN_CODE === undefined) {
    localStorage.removeItem(SESSION_KEY);
    throw new Error('Máy chủ không trả mã phiên mới. Vui lòng đăng nhập lại.');
  }

  saveSession({ username: session.username, reloginCode: response.RE_LOGIN_CODE });
  isAuthenticated = true;
};

export const getUserList = async (): Promise<ChatListEntry[]> => {
  await ensureAuthenticated();
  const entries = await sendRequest<ChatListEntry[]>('GET_USER_LIST', {});
  return Array.isArray(entries) ? entries : [];
};

export const logoutUser = async (): Promise<void> => {
  try {
    if (isAuthenticated || readSession() !== null) {
      await ensureAuthenticated();
      await sendRequest<string>('LOGOUT');
    }
  } finally {
    localStorage.removeItem(SESSION_KEY);
    isAuthenticated = false;
    socket?.close();
    socket = null;
  }
};
export const createRoom = async (
    payload: CreateRoomPayload,
): Promise<CreateRoomResponse> => {
  await ensureAuthenticated();
  return sendRequest<CreateRoomResponse>('CREATE_ROOM', {name:payload.name},);
};
export const joinRoom = async (
    payload: JoinRoomPayload,
): Promise<JoinRoomResponse> => {
  await ensureAuthenticated();
  return sendRequest<JoinRoomResponse>('JOIN_ROOM', {name:payload.name},);
};