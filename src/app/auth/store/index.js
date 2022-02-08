import { combineReducers } from '@reduxjs/toolkit';
import login from './loginSlice';
import register from './registerSlice';
import user from './userSlice';
import verify from './verifySlice';

const authReducers = combineReducers({
  user,
  login,
  register,
  verify
});

export default authReducers;
