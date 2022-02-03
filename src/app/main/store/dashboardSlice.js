import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllStrikeData = createAsyncThunk('main/dashboard/getAllStrikeData', async (content) => {
  if (!content) return;
  try {
    const { type, date } = content;
    const response = await axios.post('/api/result/all-strikes', { type, date });
    const data = await response.data;
    return data.items;
  } catch (err) {
    console.log(err);
  }
});

export const getPastStrikeData = createAsyncThunk('main/dashboard/getPastStrikeData', async (content) => {
  if (!content) return;
  try {
    const { type, date } = content;
    const response = await axios.post('/api/result/all-strikes', { type, date });
    const data = await response.data;
    return data.items;
  } catch (err) {
    console.log(err);
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    allStrike: {
      items: [],
      dataRange: [],
      xRange: [],
      loading: true,
      errors: []
    },
    pastStrike: {
      items: [],
      dataRange: [],
      xRange: [],
      loading: true,
      errors: []
    }
  },
  reducers: {

  },
  extraReducers: {
    [getAllStrikeData.pending]: (state, action) => {
      state.allStrike.errors = [];
      state.allStrike.loading = true;
    },
    [getAllStrikeData.fulfilled]: (state, action) => {
      state.allStrike.items = action.payload.data;
      state.allStrike.dataRange = action.payload.dataRange;
      state.allStrike.xRange = action.payload.xRange;
      state.allStrike.errors = [];
      state.allStrike.loading = false;
    },
    [getAllStrikeData.rejected]: (state, action) => {
      state.allStrike.errors = action.payload;
      state.allStrike.loading = false;
    },
    [getPastStrikeData.pending]: (state, action) => {
      state.pastStrike.errors = [];
      state.pastStrike.loading = true;
    },
    [getPastStrikeData.fulfilled]: (state, action) => {
      state.pastStrike.items = action.payload.data;
      state.pastStrike.dataRange = action.payload.dataRange;
      state.pastStrike.xRange = action.payload.xRange;
      state.pastStrike.errors = [];
      state.pastStrike.loading = false;
    },
    [getPastStrikeData.rejected]: (state, action) => {
      state.pastStrike.errors = action.payload;
      state.pastStrike.loading = false;
    }
  }
});

export const { setLoading } = dashboardSlice.actions;

export default dashboardSlice.reducer;