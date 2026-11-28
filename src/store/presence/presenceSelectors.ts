import type { RootState } from '../rootReducer';

export function selectOnlineStatusByUsername(state: RootState): Record<string, boolean> {
  return state.presence.onlineStatusByUsername;
}

export function selectIsUserOnline(state: RootState, username: string): boolean {
  const onlineStatusByUsername = selectOnlineStatusByUsername(state);
  return onlineStatusByUsername[username] === true;
}
