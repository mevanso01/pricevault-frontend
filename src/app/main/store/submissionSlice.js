import { createSlice } from '@reduxjs/toolkit';

const submissionSlice = createSlice({
  name: 'submission',
  initialState: {
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { setLoading } = submissionSlice.actions;

export default submissionSlice.reducer;