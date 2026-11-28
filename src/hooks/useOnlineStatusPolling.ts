import { useEffect, useMemo } from 'react';
import type { Conversation } from '../types/conversation.types';
import {
  ONLINE_POLL_INTERVAL_MS,
  ONLINE_STATUS_ERROR_MESSAGE,
} from '../constants/presence.constants';
import { onlineStatusService } from '../services/OnlineStatusService';
import {
  setOnlineError,
  setOnlineLoading,
  setOnlineStatus,
} from '../store/presence/presenceActions';
import { useAppDispatch } from './useAppDispatch';

function collectDirectUsernames(conversations: Conversation[]): string[] {
  const usernames: string[] = [];
  for (const conversation of conversations) {
    if (conversation.type === 'direct' && conversation.name !== undefined) {
      usernames.push(conversation.name);
    }
  }
  return usernames;
}

export function useOnlineStatusPolling(conversations: Conversation[]): void {
  const dispatch = useAppDispatch();

  const contactUsernames = useMemo(
    function selectContactUsernames() {
      return collectDirectUsernames(conversations);
    },
    [conversations],
  );

  useEffect(
    function startOnlineStatusPolling() {
      if (contactUsernames.length === 0) {
        return;
      }

      let isActive = true;
      let isRefreshing = false;

      async function refreshOnlineStatuses(): Promise<boolean> {
        if (isRefreshing) {
          return false;
        }
        isRefreshing = true;

        let hasError = false;
        try {
          for (const username of contactUsernames) {
            try {
              const isOnline = await onlineStatusService.checkOnline(username);
              if (!isActive) {
                return hasError;
              }
              dispatch(setOnlineStatus(username, isOnline));
            } catch {
              hasError = true;
            }
          }
        } finally {
          isRefreshing = false;
        }

        return hasError;
      }

      async function runInitialCheck(): Promise<void> {
        dispatch(setOnlineLoading(true));
        const hasError = await refreshOnlineStatuses();
        if (isActive) {
          dispatch(setOnlineError(hasError ? ONLINE_STATUS_ERROR_MESSAGE : null));
          dispatch(setOnlineLoading(false));
        }
      }

      function handlePollTick(): void {
        void refreshOnlineStatuses();
      }

      void runInitialCheck();
      const intervalId = window.setInterval(handlePollTick, ONLINE_POLL_INTERVAL_MS);

      function stopPolling(): void {
        isActive = false;
        window.clearInterval(intervalId);
      }

      return stopPolling;
    },
    [contactUsernames, dispatch],
  );
}
