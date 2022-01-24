import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import SaveIcon from '@mui/icons-material/Save';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../store/tradeSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getInstruments } from '../store/instrumentsSlice';

import FileUploader from 'app/shared-components/FileUploader';
import ConfirmModal from 'app/shared-components/ConfirmModal';
import AssetsItem from './components/AssetsItem';
import InstrumentsItem from './components/InstrumentsItem';

const TradeAdmin = () => {
  const dispatch = useDispatch();
  const loading = useSelector(({ main }) => main.trade.loading);
  const msg = useSelector(({ main }) => main.assets.msg);
  const instruments = useSelector(({ main }) => main.instruments.items);

  const [tabIndex, setTabIndex] = useState('1');
  const [csvData, setCsvData] = useState(null);
  const [isReset, setIsReset] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [instrumentId, setInstrumentId] = useState('');

  const toggleSnackBar = (type, msg) => {
    dispatch(
      showMessage({
        message: msg, //text or html
        autoHideDuration: 6000, //ms
        anchorOrigin: {
          vertical  : 'top', //top bottom
          horizontal: 'right' //left center right
        },
        variant: type //success error info warning null
      })
    );
  }

  useEffect(async () => {
    await dispatch(getInstruments());
  }, [dispatch]);

  useEffect(() => {
    if(msg){
      toggleSnackBar('error', msg);
    }
  }, [msg]);

  const handleChangeInstrumentId = (event) => {
    setInstrumentId(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const getTradePayload = (data) => {
    var arr = [];
    data.map(item => {
      if(isNaN(item.data.tradeid)) return false;
      arr.push({
        tradeId: +item.data.tradeid,
        expiry: item.data.expiry,
        tenor: item.data.tenor_ || item.data.tenor,
        strikeRelative: +item.data.strike_ || +item.data.strike,
        optionType: item.data.type,
        underlying: item.data.underlying,
        onshoreOffshore: item.data.onshoreoffshore,
        collateralConvention: item.data.collateralconvention,
        settlementType: item.data.settlementtype,
        priceConvention: item.data.priceconvention,
        strikeFixed: +item.data.strikefixed,
        exerciseType: item.data.exercisetype,
        swapFixedDCC: item.data.swapfixeddcc,
        swapFixedFrequency: item.data.swapfixedfrequency,
        swapFloatDCC: item.data.swapFloatDCC
      });
    });

    return arr;
  }

  const getTradeIdPayload = (data) => {
    var arr = [];
    data.map(item => {
      if(isNaN(item.data.tradeid)) return false;
      arr.push(+item.data.tradeid);
    });

    return arr;
  }

  const checkDuplicatedTrades = (payload) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/trade/check-trades', {
          items: JSON.stringify(payload),
          instrumentTypeId: instrumentId
        })
        .then((response) => {
          const { data } = response;
          if (data.success) {
            resolve(data.duplicates);
          } else {
            reject(data.errors);
          }
        });
    });
  }

  const saveToDatabase = (payload) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/trade', {
          items: JSON.stringify(payload),
          instrumentTypeId: instrumentId
        })
        .then((response) => {
          const { data } = response;
          if (data.success) {
              resolve("Uploaded successfully!");
          } else {
              reject(data.errors);
          }
        });
    });
  };

  const handleSaveClick = async () => {
    if(!csvData) return false;
    dispatch(setLoading(true));
    try {
      // Check if duplicated data is in there
      let tradeIds = getTradeIdPayload(csvData);
      let duplicates = await checkDuplicatedTrades(tradeIds);
      console.log('duplicated items: ', duplicates)
      if(duplicates > 0) {
        setShowConfirmModal(true);
        dispatch(setLoading(false));
        return false;
      }
      // Save into database
      let payload = getTradePayload(csvData);
      let saved = await saveToDatabase(payload);
      toggleSnackBar('success', saved);
      setIsReset(prev => !prev);
      setInstrumentId('');
      dispatch(setLoading(false));
    } catch (err) {
      toggleSnackBar('error', err[0]);
      setIsReset(prev => !prev);
      setInstrumentId('');
      dispatch(setLoading(false));
    }
  }

  const saveConfirmed = async () => {
    setShowConfirmModal(false);
    dispatch(setLoading(true));
    try {
      // Save into database
      let payload = getTradePayload(csvData);
      let saved = await saveToDatabase(payload);
      toggleSnackBar('success', saved);
    } catch (err) {
      toggleSnackBar('error', err[0]);
    } finally {
      setIsReset(prev => !prev);
      setInstrumentId('');
      dispatch(setLoading(false));
    }
  }

  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className='mt-8 mx-0 w-full'>
      <TabContext value={tabIndex}>
        <Box>
          <TabList onChange={handleTabChange} aria-label="dashboard-tab">
            <Tab label="Assets" value="1" />
            <Tab label="InstrumentTypes" value="2" />
            <Tab label="Trades" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1" className="px-0 w-full">
          <AssetsItem />
        </TabPanel>
        <TabPanel value="2" className="px-0 w-full">
          <InstrumentsItem />
        </TabPanel>
        <TabPanel value="3" className="px-0 w-full">
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} className='w-full'>
              <Box className="p-8">
                <FileUploader 
                  setCsvData={setCsvData} 
                  isReset={isReset}
                />
                <Box className="mt-12 flex justify-center">
                  <Box sx={{ minWidth: 250 }}>
                    <FormControl fullWidth>
                      <InputLabel id="instruments-select-label">{'Instrument Type *'}</InputLabel>
                      <Select
                        labelId="instruments-select-label"
                        id="instruments-select"
                        value={instrumentId}
                        label="Instrument Type *"
                        onChange={handleChangeInstrumentId}
                      >
                        {instruments.map(item => {
                          const infoArray = [];
                          if(item.name) infoArray.push(item.name);
                          if(item.currency) infoArray.push(item.currency);
                          if(item.serviceFrequency) infoArray.push(item.serviceFrequency);
                          return (
                            <MenuItem key={item._id} value={item._id}>{infoArray.join(', ')}</MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </Box>
                  <LoadingButton
                    onClick={handleSaveClick}
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="contained"
                    color="success"
                    className="ml-8"
                    disabled={!csvData || !instrumentId}
                  >
                    Save
                  </LoadingButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </TabContext>
      
      <ConfirmModal
        title={''}
        open={showConfirmModal}
        setOpen={setShowConfirmModal}
        handleClickOk={saveConfirmed}
        handleClickCancel={() => setIsReset(prev => !prev)}
      >
        <Typography variant="subtitle1" textAlign={'center'} display={'block'} component={'span'}>
          TradeId duplicates found for several trades.
        </Typography>
        <Typography variant="subtitle1" textAlign={'center'} display={'block'} component={'span'}>
          If you continue, you'll lose old values.
        </Typography>
        <Typography variant="subtitle1" textAlign={'center'} display={'block'} component={'span'}>
          Are you sure to proceed?
        </Typography>
      </ConfirmModal>
    </Grid>
  );
};

export default TradeAdmin;
