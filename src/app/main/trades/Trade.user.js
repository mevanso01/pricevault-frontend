import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DownloadIcon from '@mui/icons-material/Download';
import ToastrBar from 'app/shared-components/ToastrBar';
import { jsonToCSV } from 'react-papaparse';

const TradeUser = () => {
  const [downloading, setDownloading] = useState(false);
  const [snackBar, setSnackBar] = useState({
    isOpen: false,
    msg: '',
    type: 'success'
  });

  const toggleSnackBar = (isOpen, type, msg) => {
    setSnackBar({
      isOpen: isOpen,
      type: type,
      msg: msg
    });
  }

  const getTradeDataAsync = async () => {
    try {
      const response = await axios.get('/api/trade');
      const data = response.data;
      return data.items;
    } catch(err) {
      console.log(err);
      return [];
    }
  }

  const tradeArrayToDownload = (arr) => {
    const newArr = arr.map((item) => {
      const { _id, instrumentTypeId, userId, createdAt, updatedAt, __v, ...partialObject } = item;
      return partialObject;
    })
    return newArr;
  }

  const downloadCSV = (arr) => {
    const csv = jsonToCSV(arr);
    const blob = new Blob([csv], { type: "data:text/csv;charset=utf-8," });
    const blobURL = window.URL.createObjectURL(blob);
    const filename = "trades-" + moment(new Date()).format('YYYY-MM-DD') + ".csv";

    const anchor = document.createElement('a');
    anchor.href = blobURL;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Remove URL.createObjectURL. The browser should not save the reference to the file.
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      URL.revokeObjectURL(blobURL);
    }, 100);
  }

  const handleDownloadClick = async () => {
    setDownloading(true);
    try {
      // get trade data from database
      const trades = await getTradeDataAsync();
      if(!trades || trades.length == 0) {
        toggleSnackBar(true, 'error', 'No trade data.');
        return false;
      }
      // rearrange trade data
      const ordered = tradeArrayToDownload(trades);
      // download csv file
      downloadCSV(ordered);
      // toggle success message
      toggleSnackBar(true, 'success', 'All trade data has been Downloaded.');
    } catch(err) {
      console.log(err);
      toggleSnackBar(true, 'error', 'Failed to download trade data.');
    } finally {
      setDownloading(false);
    }
  }

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    toggleSnackBar(false, 'success', '');
  };

  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className='mt-8 mx-0 w-full'>
      <Typography variant="subtitle1" mt={4} mb={2} component={'span'} className='mx-auto'>
          Download a CSV file of your own.
      </Typography>
      <Box className="mt-12 flex justify-center w-full">
        <LoadingButton
          onClick={handleDownloadClick}
          loading={downloading}
          startIcon={<DownloadIcon />}
          variant="contained"
          color="success"
          style={{minWidth: '200px'}}
        >
          Download
        </LoadingButton>
      </Box>

      <ToastrBar
        open={snackBar.isOpen}
        message={snackBar.msg}
        severity={snackBar.type}
        handleClose={handleSnackClose}
      />
    </Grid>
  );
};

export default TradeUser;
