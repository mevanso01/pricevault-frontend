import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import { setUserData } from './userSlice';

export const submitRegister =
  ({ displayName, password, email }) =>
  async (dispatch) => {
    dispatch(setProgress(true));
    return jwtService
      .createUser({
        displayName,
        password,
        email,
      })
      .then(() => {
        dispatch(setProgress(false));
        return dispatch(registerSuccess());
      })
      .catch((errors) => {
        dispatch(setProgress(false));
        return dispatch(registerError(errors));
      });
  };

const initialState = {
  success: false,
  progress: false,
  errors: [],
};

const registerSlice = createSlice({
  name: 'auth/register',
  initialState,
  reducers: {
    registerSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    registerError: (state, action) => {
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

export const { registerSuccess, registerError, resetSlice, setProgress } = registerSlice.actions;

export default registerSlice.reducer;
