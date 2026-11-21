import {
  SET_ONLINE_ERROR,
  SET_ONLINE_LOADING,
  SET_USER_ONLINE_STATUS,
} from './presenceActionTypes';
import type { PresenceAction } from './presenceActions';

export interface PresenceState {
  onlineByName: Record<string, boolean>;
  isLoading: boolean;
  error: string | null;
}

export const initialPresenceState: PresenceState = {
  onlineByName: {},
  isLoading: false,
  error: null,
};

export const presenceReducer = (
  state: PresenceState = initialPresenceState,
  action: PresenceAction,
): PresenceState => {
  switch (action.type) {
    case SET_USER_ONLINE_STATUS:
      return {
        ...state,
        onlineByName: {
          ...state.onlineByName,
          [action.payload.name]: action.payload.status,
        },
      };
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
};
