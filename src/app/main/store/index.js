import { combineReducers } from '@reduxjs/toolkit';
import dashboard from './dashboardSlice';
import instruments from './instrumentsSlice';
import assets from './assetsSlice';
import trade from './tradeSlice';
import submission from './submissionSlice';

const reducer = combineReducers({
  dashboard,
  assets,
  instruments,
  trade,
  submission
});

export default reducer;
