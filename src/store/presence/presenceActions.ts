import {
  SET_ONLINE_ERROR,
  SET_ONLINE_LOADING,
  SET_USER_ONLINE_STATUS,
} from './presenceActionTypes';

export interface SetUserOnlineStatusAction {
  type: typeof SET_USER_ONLINE_STATUS;
  payload: {
    name: string;
    status: boolean;
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
  | SetUserOnlineStatusAction
  | SetOnlineLoadingAction
  | SetOnlineErrorAction;

export const setUserOnlineStatus = (
  name: string,
  status: boolean,
): SetUserOnlineStatusAction => ({
  type: SET_USER_ONLINE_STATUS,
  payload: { name, status },
});

export const setOnlineLoading = (isLoading: boolean): SetOnlineLoadingAction => ({
  type: SET_ONLINE_LOADING,
  payload: isLoading,
});

export const setOnlineError = (error: string | null): SetOnlineErrorAction => ({
  type: SET_ONLINE_ERROR,
  payload: error,
});
