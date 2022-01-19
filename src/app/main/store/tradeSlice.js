import { createSlice } from '@reduxjs/toolkit';

const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { setLoading } = tradeSlice.actions;

export default tradeSlice.reducer;