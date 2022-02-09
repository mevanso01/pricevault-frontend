import { combineReducers } from '@reduxjs/toolkit';
import dashboard from './dashboardSlice';
import instruments from './instrumentsSlice';
import assets from './assetsSlice';
import trade from './tradeSlice';
import submission from './submissionSlice';
import profile from './profileSlice';

const reducer = combineReducers({
  dashboard,
  assets,
  instruments,
  trade,
  submission,
  profile
});

export default reducer;
