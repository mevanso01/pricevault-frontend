import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAssets = createAsyncThunk('main/asset/getAssets', async () => {
  try {
    const response = await axios.get('/api/asset');
    const data = await response.data;

    return data.items;
  } catch(err) {
    console.log(err);
  }
});

export const createAsset = createAsyncThunk(
  'main/asset/createAsset',
  async (assetData, { dispatch, getState }) => {
    console.log('data', getState())
    const { asset } = getState().main;
    const response = await axios.post('/api/asset', {
      ...asset,
      ...assetData,
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

export const updateAsset = createAsyncThunk(
  'main/asset/updateAsset',
  async (assetData, { dispatch, getState }) => {
    console.log('data', getState())
    const { asset } = getState().main;
    const response = await axios.put('/api/asset', {
      ...asset,
      ...assetData,
    });
    const data = await response.data;
    if(!data.success){
      return {
        error: true,
        msg: data.errors[0]
      };
    }
    return assetData;
  }
);

export const removeAssets = createAsyncThunk(
  'main/asset/removeAssets',
  async (assetIds, { dispatch, getState }) => {
    await axios.post('/api/asset/remove', { items: assetIds });

    return assetIds;
  }
);

const assetsAdapter = createEntityAdapter({});

export const { selectAll: selectAssets, selectById: selectAssetById } =
  assetsAdapter.getSelectors((state) => state.main.assets);

const assetsSlice = createSlice({
  name: 'main/assets',
  initialState: assetsAdapter.getInitialState({
    searchText: '',
    items: [],
    msg: ''
  }),
  reducers: {
    setAssetsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    }
  },
  extraReducers: {
    [getAssets.fulfilled]: (state, action) => {
      state.items = action.payload;
    },
    [createAsset.fulfilled]: (state, action) => {
      if(action.payload.error) {
        state.msg = action.payload.msg;
        return;
      }
      state.items.push(action.payload);
    },
    [updateAsset.fulfilled]: (state, action) => {
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
    [removeAssets.fulfilled]: (state, action) => {
      state.items = [...state.items].filter(item => !action.payload.includes(item._id));
    }
  },
});

export const { setAssetsSearchText } = assetsSlice.actions;

export default assetsSlice.reducer;
