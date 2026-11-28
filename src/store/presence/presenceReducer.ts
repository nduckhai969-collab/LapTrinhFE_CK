import {
  SET_ONLINE_ERROR,
  SET_ONLINE_LOADING,
  SET_ONLINE_STATUS,
} from './presenceActionTypes';
import type { PresenceAction } from './presenceActions';

export interface PresenceState {
  onlineStatusByUsername: Record<string, boolean>;
  isLoading: boolean;
  error: string | null;
}

export const initialPresenceState: PresenceState = {
  onlineStatusByUsername: {},
  isLoading: false,
  error: null,
};

export function presenceReducer(
  state: PresenceState = initialPresenceState,
  action: PresenceAction,
): PresenceState {
  switch (action.type) {
    case SET_ONLINE_STATUS: {
      const nextOnlineStatusByUsername = {
        ...state.onlineStatusByUsername,
        [action.payload.username]: action.payload.isOnline,
      };
      return {
        ...state,
        onlineStatusByUsername: nextOnlineStatusByUsername,
      };
    }

    case SET_ONLINE_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case SET_ONLINE_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}
