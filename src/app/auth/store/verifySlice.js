import { createSlice } from '@reduxjs/toolkit';
import jwtService from 'app/services/jwtService';
import axios from 'axios';
import { setUserData } from './userSlice';

export const submitVerify = (userId, code) => async (dispatch) => {
  dispatch(setProgress(true));
  return jwtService
    .verifyOTP(userId, code)
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

export const sendOTP = (userId) => async (dispatch) => {
  dispatch(setProgress(true));
  try {
    const response = await axios.post('/api/auth/send-otp', { userId });
    const { data } = response;
    if (data.success) {
      dispatch(sendSuccess());
    } else {
      dispatch(verifyError(data.errors));
    }
  } catch (err) {
    console.log(err);
    dispatch(verifyError(err));
  } finally {
    dispatch(setProgress(false));
  }
};

const initialState = {
  success: false,
  sending: false,
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
    sendSuccess: (state, action) => {
      state.sending = true;
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
      state.sending = false;
      state.progress = false;
      state.errors = [];
    },
    setProgress: (state, action) => {
      state.progress = !!action.payload;
    }
  },
  extraReducers: {},
});

export const { verifySuccess, sendSuccess, verifyError, resetSlice, setProgress } = verifySlice.actions;

export default verifySlice.reducer;
