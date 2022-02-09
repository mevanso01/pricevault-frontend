import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const updateProfile = (user) => async (dispatch) => {
  dispatch(setLoading(true));
  const response = await axios.put('/api/profile', user);
  const data = await response.data;
  if (data.success) {
    dispatch(setLoading(false));
    dispatch(profileSuccess());
  } else {
    dispatch(setLoading(false));
    dispatch(profileError(data.errors));
  }
};

const initialState = {
  loading: false,
  success: false,
  errors: [],
};

const profileSlice = createSlice({
  name: 'main/profile',
  initialState,
  reducers: {
    profileSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    profileError: (state, action) => {
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
    setLoading: (state, action) => {
      state.loading = !!action.payload;
    }
  },
  extraReducers: {},
});

export const { profileSuccess, profileError, resetSlice, setLoading } = profileSlice.actions;

export default profileSlice.reducer;
