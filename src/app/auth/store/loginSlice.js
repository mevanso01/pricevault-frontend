import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import { setUserData } from './userSlice';

export const submitLogin =
  ({ email, password }) =>
  async (dispatch) => {
    dispatch(setProgress(true));
    return jwtService
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        dispatch(setProgress(false));
        dispatch(setUserData(user));
        return dispatch(loginSuccess());
      })
      .catch((errors) => {
        dispatch(setProgress(false));
        return dispatch(loginError(errors));
      });
  };

const initialState = {
  success: false,
  progress: false,
  errors: [],
};

const loginSlice = createSlice({
  name: 'auth/login',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    loginError: (state, action) => {
      state.success = false;
      if (Array.isArray(action.payload)) {
        state.errors = action.payload;
      } else {
        state.errors = [action.payload];
      }
    },
    resetSlice: (state, action) => {
      state.success = false;
      state.progress = false;
      state.errors = [];
    },
    setProgress: (state, action) => {
      state.progress = !!action.payload;
    }
  },
  extraReducers: {},
});

export const { loginSuccess, loginError, resetSlice, setProgress } = loginSlice.actions;

export default loginSlice.reducer;
