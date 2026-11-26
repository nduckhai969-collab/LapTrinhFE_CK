export const ACTION = 'onchat' as const;

export const SOCKET_EVENTS = {
  REGISTER: 'REGISTER',
  LOGIN: 'LOGIN',
  RE_LOGIN: 'RE_LOGIN',
  LOGOUT: 'LOGOUT',
  GET_USER_LIST: 'GET_USER_LIST',
  CREATE_ROOM: 'CREATE_ROOM',
  JOIN_ROOM: 'JOIN_ROOM',
  OUT_ROOM: 'OUT_ROOM',
  GET_ROOM_CHAT_MES: 'GET_ROOM_CHAT_MES',
  GET_PEOPLE_CHAT_MES: 'GET_PEOPLE_CHAT_MES',
  SEND_CHAT: 'SEND_CHAT',
  CHECK_USER_ONLINE: 'CHAT_CHECK_USER_ONLINE',
  CHECK_USER_ONLINE_LEGACY: 'CHECK_USER_ONLINE',
  CHECK_USER_EXIST: 'CHAT_CHECK_USER_EXIST',
  CHECK_USER_EXIST_LEGACY: 'CHECK_USER_EXIST',
} as const;

export type SocketEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];

// The API request names these checks with a CHAT_ prefix, but its examples
// return the corresponding response events without that prefix.
export const SOCKET_RESPONSE_EVENT_ALIASES: Partial<Record<SocketEvent, string>> = {
  [SOCKET_EVENTS.CHECK_USER_ONLINE]: 'CHECK_USER_ONLINE',
  [SOCKET_EVENTS.CHECK_USER_EXIST]: 'CHECK_USER_EXIST',
};

export const SOCKET_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type SocketStatus = typeof SOCKET_STATUS[keyof typeof SOCKET_STATUS];
