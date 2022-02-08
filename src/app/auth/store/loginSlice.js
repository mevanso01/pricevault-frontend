import { createSlice } from '@reduxjs/toolkit';
import jwtService from 'app/services/jwtService';
import { setUserData } from './userSlice';

export const submitLogin = ({ email, password }) => async (dispatch) => {
  dispatch(setProgress(true));
  return jwtService
    .signInWithEmailAndPassword(email, password)
    .then((res) => {
      dispatch(setProgress(false));
      if (res.enabledVerify) {
        dispatch(setUserId(res.user.data.id));
      } else {
        dispatch(setUserData(res.user));
      }
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
  userId: ''
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
      state.userId = '';
    },
    setProgress: (state, action) => {
      state.progress = !!action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    }
  },
  extraReducers: {},
});

export const { loginSuccess, loginError, resetSlice, setProgress, setUserId } = loginSlice.actions;

export default loginSlice.reducer;
