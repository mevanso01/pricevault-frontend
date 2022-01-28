import React from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';

import ToolbarItem from './../ToolbarItem';

const Item = styled('div')(({ theme }) => ({
  ...theme.typography.body2,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Toolbar = (props) => {
  const {
    instrumentType,
    date,
    lookBack,
    vols,
    handleInstrumentTypeChange,
    handleDateChange,
    handleLookBackChange,
    handleVolsChange
  } = props;

  const instruments = useSelector(({ main }) => main.instruments.items);

  return (
    <Stack direction="row" spacing={1} flexWrap={'wrap'}>
      <Item className="md:pl-0">
        <IconButton
          aria-label="refresh"
          size="small"
          style={{ border: '1px solid #e4e6e8', borderRadius: '5px', height: '30px' }}
        >
          <RefreshIcon fontSize='18px' />
        </IconButton>
      </Item>
      <Item>
        <ToolbarItem title={'InstrumentType'}>
          {instrumentType && (
            <Select
              id="instrumentType-select"
              variant="standard"
              MenuProps={{
                disableScrollLock: true,
              }}
              value={instrumentType}
              onChange={(e) => handleInstrumentTypeChange(e)}
            >
              {instruments.map(item => {
                const infoArray = [];
                if (item.name) infoArray.push(item.name);
                if (item.currency) infoArray.push(item.currency);
                if (item.serviceFrequency) infoArray.push(item.serviceFrequency);
                return (
                  <MenuItem key={item._id} value={item._id}>{infoArray.join(', ')}</MenuItem>
                )
              })}
            </Select>
          )}
        </ToolbarItem>
      </Item>
      <Item>
        <ToolbarItem title={'Date'}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={date}
              onChange={handleDateChange}
              inputFormat="dd MMM yy"
              renderInput={(params) => <TextField {...params} />}
              inputProps={{ style: { width: 80, fontSize: 14, padding: '6px 0 6px 12px' } }}
            />
          </LocalizationProvider>
        </ToolbarItem>
      </Item>
      <Item>
        <ToolbarItem title={'Lookback'}>
          <ToggleButtonGroup
            size="small"
            value={lookBack}
            exclusive
            onChange={handleLookBackChange}
            aria-label="lookBack button group"
          >
            <ToggleButton value="1D" aria-label="1D">1D</ToggleButton>
            <ToggleButton value="1W" aria-label="1W">1W</ToggleButton>
            <ToggleButton value="1M" aria-label="1M">1M</ToggleButton>
            <ToggleButton value="3M" aria-label="3M">3M</ToggleButton>
            <ToggleButton value="1Y" aria-label="1Y">1Y</ToggleButton>
            <ToggleButton value="custom" aria-label="custom">Custom date...</ToggleButton>
          </ToggleButtonGroup>
        </ToolbarItem>
      </Item>
      <Item>
        <ToolbarItem title={'Vols'}>
          <ToggleButtonGroup
            size="small"
            value={vols}
            exclusive
            onChange={handleVolsChange}
            aria-label="Vols button group"
          >
            <ToggleButton value="Vols" aria-label="Vols">
              Vols
            </ToggleButton>
            <ToggleButton value="Stdev" aria-label="Stdev">
              Stdev
            </ToggleButton>
          </ToggleButtonGroup>
        </ToolbarItem>
      </Item>
    </Stack>
  );
}

export default Toolbar;