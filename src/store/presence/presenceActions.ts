import {
  SET_ONLINE_ERROR,
  SET_ONLINE_LOADING,
  SET_ONLINE_STATUS,
} from './presenceActionTypes';

export interface SetOnlineStatusAction {
  type: typeof SET_ONLINE_STATUS;
  payload: {
    username: string;
    isOnline: boolean;
  };
}

export interface SetOnlineLoadingAction {
  type: typeof SET_ONLINE_LOADING;
  payload: boolean;
}

export interface SetOnlineErrorAction {
  type: typeof SET_ONLINE_ERROR;
  payload: string | null;
}

export type PresenceAction =
  | SetOnlineStatusAction
  | SetOnlineLoadingAction
  | SetOnlineErrorAction;

export function setOnlineStatus(
  username: string,
  isOnline: boolean,
): SetOnlineStatusAction {
  return {
    type: SET_ONLINE_STATUS,
    payload: { username, isOnline },
  };
}

export function setOnlineLoading(isLoading: boolean): SetOnlineLoadingAction {
  return {
    type: SET_ONLINE_LOADING,
    payload: isLoading,
  };
}

export function setOnlineError(error: string | null): SetOnlineErrorAction {
  return {
    type: SET_ONLINE_ERROR,
    payload: error,
  };
}
