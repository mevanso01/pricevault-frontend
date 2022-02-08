import { createSlice } from '@reduxjs/toolkit';
import jwtService from 'app/services/jwtService';
import { setUserData } from './userSlice';

export const submitVerify = (userId, code) => async (dispatch) => {
  console.log(userId, code)
  dispatch(setProgress(true));
  return jwtService
    .verifyPhoneCode(userId, code)
    .then((user) => {
      dispatch(setProgress(false));
      dispatch(setUserData(user));
      return dispatch(verifySuccess());
    })
    .catch((errors) => {
      dispatch(setProgress(false));
      return dispatch(verifyError(errors));
    });
};

const initialState = {
  success: false,
  progress: false,
  errors: [],
};

const verifySlice = createSlice({
  name: 'auth/verify',
  initialState,
  reducers: {
    verifySuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    verifyError: (state, action) => {
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

export const { verifySuccess, verifyError, resetSlice, setProgress } = verifySlice.actions;

export default verifySlice.reducer;
