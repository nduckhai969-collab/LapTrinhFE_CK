import { SOCKET_EVENTS } from '../constants/socket.constants';
import type { OnlineStatusResponse } from '../types/presence.types';
import { sendSocket } from './websocket.service';

class OnlineStatusService {
  private lastRequest: Promise<unknown> = Promise.resolve();

  public checkOnline(username: string): Promise<boolean> {
    const previousRequest = this.lastRequest;
    const currentRequest = this.sendCheckRequest(previousRequest, username);
    this.lastRequest = this.ignoreError(currentRequest);
    return currentRequest;
  }

  private async sendCheckRequest(
    previousRequest: Promise<unknown>,
    username: string,
  ): Promise<boolean> {
    await previousRequest;

    const response = await sendSocket<OnlineStatusResponse>(
      SOCKET_EVENTS.CHECK_USER_ONLINE,
      { user: username },
    );
    return response.status === true;
  }

  private async ignoreError(request: Promise<unknown>): Promise<void> {
    try {
      await request;
    } catch {

    }
  }
}

export const onlineStatusService = new OnlineStatusService();
