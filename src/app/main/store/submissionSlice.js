import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getSubmissions = createAsyncThunk('main/asset/getSubmissions', async () => {
  try {
    const response = await axios.get('/api/submission');
    const data = await response.data;
    return data.items;
  } catch (err) {
    console.log(err);
  }
});

const submissionSlice = createSlice({
  name: 'submission',
  initialState: {
    loading: false,
    items: []
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
  extraReducers: {
    [getSubmissions.fulfilled]: (state, action) => {
      state.items = action.payload;
    }
  }
});

export const { setLoading } = submissionSlice.actions;

export default submissionSlice.reducer;