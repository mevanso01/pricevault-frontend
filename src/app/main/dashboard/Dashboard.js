import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseLoading from '@fuse/core/FuseLoading';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { getInstruments } from '../store/instrumentsSlice';
import { getAllStrikeData } from '../store/dashboardSlice';

import Toolbar from './components/Toolbar';
import HeatChart from './../../shared-components/HeatChart';
import LineChart from '../../shared-components/LineChart';
import moment from 'moment';

// Demo data for charts
import heatData from './demo-data/heat.json';
import stockData from './demo-data/stock.json';

const Root = styled(FusePageSimple)({
  '& .FusePageSimple-header': { display: 'none' },
  '& .FusePageSimple-toolbar': {},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
});

function DashboardPage(props) {
  const { t } = useTranslation('dashboardPage');

  const dispatch = useDispatch();
  const instruments = useSelector(({ main }) => main.instruments.items);
  const {
    items: AllStrikeData,
    xRange: AllStrikeXRange,
    loading: AllStrikeLoading,
    errors: AllStrikeErrors
  } = useSelector(({ main }) => main.dashboard.allStrike);

  const [tabIndex, setTabIndex] = useState('1');
  const [instrumentType, setInstrumentType] = useState('');
  const [date, setDate] = useState({
    original: new Date(),
    hashed: ''
  });
  const [lookBack, setLookBack] = useState('1Y');
  const [vols, setVols] = useState('Vols');

  useEffect(() => {
    dispatch(getInstruments());
  }, [dispatch]);

  useEffect(() => {
    if (!instrumentType) return false;
    dispatch(
      getAllStrikeData(instrumentType)
    );
  }, [instrumentType, date]);

  useEffect(() => {
    setInstrumentType(instruments[0]?._id);
  }, [instruments]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleInstrumentTypeChange = (event) => {
    setInstrumentType(event.target.value);
  };

  const handleDateChange = (newDate) => {
    const hashedDate = moment(newDate).format('yyyyMMDD');
    console.log(hashedDate)
    setDate({
      original: newDate,
      hashed: hashedDate
    });
  };

  const handleLookBackChange = (event, newLookBack) => {
    if (newLookBack !== null) {
      setLookBack(newLookBack);
    }
  };

  const handleVolsChange = (event, newVols) => {
    if (newVols !== null) {
      setVols(newVols);
    }
  };

  return (
    <Root
      content={
        <Box>
          <Box className="mb-4">
            <Toolbar
              instrumentType={instrumentType}
              date={date.original}
              lookBack={lookBack}
              vols={vols}
              handleInstrumentTypeChange={handleInstrumentTypeChange}
              handleDateChange={handleDateChange}
              handleLookBackChange={handleLookBackChange}
              handleVolsChange={handleVolsChange}
            />
          </Box>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className='border mx-0 w-full'>
            <Grid item md={6} sm={12} className='w-full'>
              {AllStrikeLoading ? (
                <FuseLoading />
              ) : AllStrikeErrors.length > 0 ? (
                <Typography variant="subtitle2" mt={4} mb={2} component={'span'} className='mx-auto'>
                  {AllStrikeErrors.join(', ')}
                </Typography>
              ) : (!AllStrikeData || AllStrikeData.length == 0) ? (
                <Typography variant="subtitle2" mt={4} mb={2} component={'span'} className='mx-auto'>
                  {'No Data.'}
                </Typography>
              ) : (
                <HeatChart
                  data={AllStrikeData}
                  xRange={AllStrikeXRange}
                  title={`Change since ${moment(date).format('DD MMM YYYY')}`}
                />
              )}
            </Grid>
            <Grid item md={6} sm={12} className='w-full'>
              <HeatChart
                data={heatData}
                title={`Change since ${moment(date).format('DD MMM YYYY')}`}
              />
            </Grid>
          </Grid>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className='border-b mt-4 mx-0 w-full'>
            <TabContext value={tabIndex}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleTabChange} aria-label="dashboard-tab">
                  <Tab label="Skew" value="1" />
                  <Tab label="Historical" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1" className="pr-0 w-full">
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className='border'>
                  <Grid item md={6} sm={12} className='w-full'>
                    <HeatChart
                      data={heatData}
                      title={`${vols} for a strikes`}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} className='w-full'>
                    <HeatChart
                      data={heatData}
                      title={`Change since ${moment(date).format('DD MMM YYYY')}`}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value="2" className="pr-0 w-full">
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className='border'>
                  <Grid item xs={12} className='w-full'>
                    <LineChart
                      data={stockData}
                      title={''}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
            </TabContext>
          </Grid>
        </Box>
      }
    />
  );
}

export default DashboardPage;
