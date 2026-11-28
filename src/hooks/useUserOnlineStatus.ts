import { useAppSelector } from './useAppSelector';
import { selectIsUserOnline } from '../store/presence/presenceSelectors';

export function useUserOnlineStatus(username: string | undefined): boolean {
  return useAppSelector(function selectOnlineStatus(state) {
    if (username === undefined) {
      return false;
    }
    return selectIsUserOnline(state, username);
  });
}
