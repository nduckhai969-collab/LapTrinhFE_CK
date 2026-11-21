import { SOCKET_EVENTS } from '../constants/socket.constants';
import {
  closeSocket,
  isSocketOpen,
  onSocketClose,
  sendSocket,
} from './websocket.service';

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

let isAuthenticated = false;

onSocketClose(() => {
  isAuthenticated = false;
});

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

export const getAuthSession = (): AuthSession | null => readSession();

export const registerUser = async (
  username: string,
  password: string,
): Promise<{ success: boolean; message: string }> => {
  const message = await sendSocket<string>(SOCKET_EVENTS.REGISTER, {
    user: username,
    pass: password,
  });
  return { success: true, message: message ?? 'Đăng ký thành công.' };
};

export const loginUser = async (
  username: string,
  password: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await sendSocket<{ RE_LOGIN_CODE?: string }>(SOCKET_EVENTS.LOGIN, {
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
  if (isAuthenticated && isSocketOpen()) {
    return;
  }

  const session = readSession();
  if (session === null) {
    throw new Error('Phiên đăng nhập không tồn tại. Vui lòng đăng nhập lại.');
  }

  const response = await sendSocket<{ RE_LOGIN_CODE?: string }>(SOCKET_EVENTS.RE_LOGIN, {
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
  const entries = await sendSocket<ChatListEntry[]>(SOCKET_EVENTS.GET_USER_LIST, {});
  return Array.isArray(entries) ? entries : [];
};

export const logoutUser = async (): Promise<void> => {
  try {
    if (isAuthenticated || readSession() !== null) {
      await ensureAuthenticated();
      await sendSocket<string>(SOCKET_EVENTS.LOGOUT);
    }
  } finally {
    localStorage.removeItem(SESSION_KEY);
    isAuthenticated = false;
    closeSocket();
  }
};
