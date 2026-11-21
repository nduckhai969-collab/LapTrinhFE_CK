import type { SocketEvent, SocketStatus } from '../constants/socket.constants';

export interface SocketEnvelope<TData = unknown> {
  action: 'onchat';
  data: {
    event: SocketEvent;
    data?: TData;
  };
}

export interface SocketResponse<TData = unknown> {
  status: SocketStatus;
  event: SocketEvent;
  data?: TData;
  mes?: string;
}
