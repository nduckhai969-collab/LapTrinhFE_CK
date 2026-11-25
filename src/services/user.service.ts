import { SOCKET_EVENTS } from '../constants/socket.constants';
import type { CheckUserOnlineResult } from '../types/user.types';
import { sendSocket } from './websocket.service';

export const checkUserOnline = async (username: string): Promise<boolean> => {
  const result = await sendSocket<CheckUserOnlineResult>(SOCKET_EVENTS.CHECK_USER_ONLINE, {
    user: username,
  });
  return result.status === true;
};
