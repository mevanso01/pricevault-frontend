import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Toolbar from './components/Toolbar';
import HeatChart from './../../shared-components/HeatChart';
import LineChart from '../../shared-components/LineChart';
import moment from 'moment';

// Demo data for charts
import heatData from './demo-data/heat.json';
import stockData from './demo-data/stock.json';

const Root = styled(FusePageSimple)({
  '& .FusePageSimple-header': {display: 'none'},
  '& .FusePageSimple-toolbar': {},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
});

function DashboardPage(props) {
    const { t } = useTranslation('dashboardPage');

    const [tabIndex, setTabIndex] = useState('1');
    const [currency, setCurrency] = useState('USD');
    const [date, setDate] = useState(new Date());
    const [lookBack, setLookBack] = useState('1Y');
    const [vols, setVols] = useState('Vols');

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
    };

    const handleDateChange = (newDate) => {
        setDate(newDate);
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
                            currency={currency} 
                            date={date}
                            lookBack={lookBack}
                            vols={vols}
                            handleCurrencyChange={handleCurrencyChange} 
                            handleDateChange={handleDateChange}
                            handleLookBackChange={handleLookBackChange}
                            handleVolsChange={handleVolsChange}
                        />
                    </Box>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className='border mx-0 w-full'>
                        <Grid item md={6} sm={12} className='w-full'>
                            <HeatChart 
                                data={heatData} 
                                title={`${currency}: Sum of ${vols} for all strikes`}
                            />
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
                                            title={`${currency}: ${vols} for a strikes`}
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
