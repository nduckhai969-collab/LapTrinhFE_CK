export const APP_CONFIG = {
  APP_NAME: 'ConnectChat',
  VERSION: '1.0.0',
  DEFAULT_AVATAR: '/assets/images/default-avatar.png',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MESSAGES_PER_PAGE: 50,
} as const;

export const ROOM_TYPE = 1;
export const PEOPLE_TYPE = 0;
export const SEND_CHAT_TYPE_ROOM = 'room';
export const SEND_CHAT_TYPE_PEOPLE = 'people';
