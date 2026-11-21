import { combineReducers } from 'redux';
import { presenceReducer } from './presence/presenceReducer';

export const rootReducer = combineReducers({
  presence: presenceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
