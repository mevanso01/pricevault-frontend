import { combineReducers } from '@reduxjs/toolkit';
import instruments from './instrumentsSlice';
import assets from './assetsSlice';
import trade from './tradeSlice';
import submission from './submissionSlice';

const reducer = combineReducers({
  assets,
  instruments,
  trade,
  submission
});

export default reducer;
