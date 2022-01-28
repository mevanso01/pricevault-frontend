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

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    allStrike: {
      items: [],
      xRange: [],
      loading: false,
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
      state.allStrike.xRange = action.payload.xRange;
      state.allStrike.errors = [];
      state.allStrike.loading = false;
    },
    [getAllStrikeData.rejected]: (state, action) => {
      state.allStrike.errors = action.payload;
      state.allStrike.loading = false;
    }
  }
});

export const { setLoading } = dashboardSlice.actions;

export default dashboardSlice.reducer;