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
import { getAllStrikeData, getPastStrikeData } from '../store/dashboardSlice';
import { getSubtractMatrix, convertLookbackToDate } from '../../services/helper';

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

  const AllStrike = useSelector(({ main }) => main.dashboard.allStrike);
  const {
    items: AllStrikeData,
    dataRange: AllStrikeDataRange,
    xRange: AllStrikeXRange,
    loading: AllStrikeLoading,
    errors: AllStrikeErrors
  } = AllStrike;

  const PastStrike = useSelector(({ main }) => main.dashboard.pastStrike);
  const {
    items: PastStrikeData,
    dataRange: PastStrikeDataRange,
    xRange: PastStrikeXRange,
    loading: PastStrikeLoading,
    errors: PastStrikeErrors
  } = PastStrike;

  const [tabIndex, setTabIndex] = useState('1');
  const [instrumentType, setInstrumentType] = useState('');
  const [date, setDate] = useState(new Date());
  const [customDate, setCustomDate] = useState(moment(date).subtract(1, "years"));
  const [lookBack, setLookBack] = useState('1Y');
  const [vols, setVols] = useState('Vols');
  const [newData, setNewData] = useState({
    items: [],
    dataRange: [],
    xRange: [],
    loading: true,
    errors: []
  });

  useEffect(() => {
    if (AllStrikeLoading || PastStrikeLoading) return;
    let newData = getSubtractMatrix(AllStrike, PastStrike);
    setNewData(newData);
  }, [AllStrikeData, PastStrikeData]);

  useEffect(() => {
    dispatch(getInstruments());
  }, [dispatch]);

  useEffect(() => {
    if (!instrumentType) return;
    dispatch(getAllStrikeData({ type: instrumentType, date: date }));
  }, [instrumentType, date]);

  useEffect(() => {
    if (!instrumentType) return;
    setNewData({ ...newData, loading: true });
    dispatch(getPastStrikeData({ type: instrumentType, date: customDate }));
  }, [instrumentType, customDate]);

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
    setDate(newDate);
    convertLookbackToDate(lookBack, newDate, setCustomDate);
  };

  const handleLookBackChange = (event, newLookBack) => {
    if (newLookBack == null) return;
    setLookBack(newLookBack);
    convertLookbackToDate(newLookBack, date, setCustomDate);
  };

  const handleVolsChange = (event, newVols) => {
    if (newVols == null) return;
    setVols(newVols);
  };

  const handleCustomDateChange = (newDate) => {
    setCustomDate(newDate);
  };

  const handleRefreshClick = () => {
    setNewData({ ...newData, loading: true });
    dispatch(getAllStrikeData({ type: instrumentType, date: date }));
    dispatch(getPastStrikeData({ type: instrumentType, date: customDate }));
  };

  return (
    <Root
      content={
        <Box>
          <Box className="mb-4">
            <Toolbar
              instrumentType={instrumentType}
              date={date}
              customDate={customDate}
              lookBack={lookBack}
              vols={vols}
              handleInstrumentTypeChange={handleInstrumentTypeChange}
              handleDateChange={handleDateChange}
              handleCustomDateChange={handleCustomDateChange}
              handleLookBackChange={handleLookBackChange}
              handleVolsChange={handleVolsChange}
              handleRefreshClick={handleRefreshClick}
            />
          </Box>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className='border mx-0 w-full'>
            <Grid item md={6} sm={12} className='w-full'>
              {AllStrikeLoading ? (
                <Box className='flex items-center h-full py-40'>
                  <FuseLoading />
                </Box>
              ) : AllStrikeErrors.length > 0 ? (
                <Box className='flex items-center h-full py-40'>
                  <Typography variant="subtitle2" component={'span'} className='mx-auto'>
                    {AllStrikeErrors.join(', ')}
                  </Typography>
                </Box>
              ) : (!AllStrikeData || AllStrikeData.length == 0) ? (
                <Box className='flex items-center h-full py-40'>
                  <Typography variant="subtitle2" component={'span'} className='mx-auto'>
                    {'No Data.'}
                  </Typography>
                </Box>
              ) : (
                <HeatChart
                  data={AllStrikeData}
                  dataRange={AllStrikeDataRange}
                  xRange={AllStrikeXRange}
                  title={`Sum of ${vols} for all strikes`}
                />
              )}
            </Grid>
            <Grid item md={6} sm={12} className='w-full'>
              {newData.loading ? (
                <Box className='flex items-center h-full py-40'>
                  <FuseLoading />
                </Box>
              ) : newData.errors.length > 0 ? (
                <Box className='flex items-center h-full py-40'>
                  <Typography variant="subtitle2" component={'span'} className='mx-auto'>
                    {newData.errors.join(', ')}
                  </Typography>
                </Box>
              ) : (!newData.items || newData.items.length == 0) ? (
                <Box className='flex items-center h-full py-40'>
                  <Typography variant="subtitle2" component={'span'} className='mx-auto'>
                    {'No Data.'}
                  </Typography>
                </Box>
              ) : (
                <HeatChart
                  data={newData.items}
                  dataRange={newData.dataRange}
                  xRange={newData.xRange}
                  title={`Change since ${moment(customDate).format('DD MMM YYYY')}`}
                />
              )}
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
                      title={`Change since ${moment(customDate).format('DD MMM YYYY')}`}
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
