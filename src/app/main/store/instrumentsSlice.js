import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getInstruments = createAsyncThunk('main/instrument/getInstruments', async () => {
  const response = await axios.get('/api/instrument');
  const data = await response.data;

  return data.items;
});

export const createInstrument = createAsyncThunk(
  'main/instrument/createInstrument',
  async (instrumentData, { dispatch, getState }) => {
    console.log('data', getState())
    const { instrument } = getState().main;
    const response = await axios.post('/api/instrument', {
      ...instrument,
      ...instrumentData,
    });
    const data = await response.data;
    if(!data.success){
      return {
        error: true,
        msg: data.errors[0]
      };
    }
    return data.items;
  }
);

export const updateInstrument = createAsyncThunk(
  'main/instrument/updateInstrument',
  async (instrumentData, { dispatch, getState }) => {
    console.log('data', getState())
    const { instrument } = getState().main;
    const response = await axios.put('/api/instrument', {
      ...instrument,
      ...instrumentData,
    });
    const data = await response.data;
    if(!data.success){
      return {
        error: true,
        msg: data.errors[0]
      };
    }
    return instrumentData;
  }
);

export const removeInstruments = createAsyncThunk(
  'main/instrument/removeInstruments',
  async (instrumentIds, { dispatch, getState }) => {
    await axios.post('/api/instrument/remove', { items: instrumentIds });

    return instrumentIds;
  }
);

const instrumentsAdapter = createEntityAdapter({});

export const { selectAll: selectInstruments, selectById: selectInstrumentById } =
  instrumentsAdapter.getSelectors((state) => state.main.instruments);

const instrumentsSlice = createSlice({
  name: 'main/instruments',
  initialState: instrumentsAdapter.getInitialState({
    searchText: '',
    items: [],
    msg: ''
  }),
  reducers: {
    setInstrumentsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    }
  },
  extraReducers: {
    [getInstruments.fulfilled]: (state, action) => {
      state.items = action.payload;
    },
    [createInstrument.fulfilled]: (state, action) => {
      if(action.payload.error) {
        state.msg = action.payload.msg;
        return;
      }
      state.items.push(action.payload);
    },
    [updateInstrument.fulfilled]: (state, action) => {
      if(action.payload.error) {
        state.msg = action.payload.msg;
        return;
      }
      const newState = state.items.map(item => {
        if(item._id == action.payload._id){
          return {...action.payload}
        }
        return item;
      });
      state.items = newState;
    },
    [removeInstruments.fulfilled]: (state, action) => {
      state.items = [...state.items].filter(item => !action.payload.includes(item._id));
    }
  },
});

export const { setInstrumentsSearchText } = instrumentsSlice.actions;

export default instrumentsSlice.reducer;
