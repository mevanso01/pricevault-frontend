import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { setLoading } from './../store/submissionSlice';

import FileUploader from 'app/shared-components/FileUploader';
import ConfirmModal from 'app/shared-components/ConfirmModal';

const Root = styled(FusePageSimple)({
  '& .FusePageSimple-header': {display: 'none'},
  '& .FusePageSimple-toolbar': {justifyContent: 'center'},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
});

const SubmissionsPage = (props) => {
  const dispatch = useDispatch();
  const loading = useSelector(({ main }) => main.submission.loading);

  const [csvData, setCsvData] = useState(null);
  const [isReset, setIsReset] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const getSubmissionPayload = (data) => {
    var arr = [];
    data.map(item => {
      if(isNaN(item.data.tradeid) || isNaN(item.data.valuation))
        return false;

      arr.push({
        tradeId: +item.data.tradeid,
        valuation: +item.data.valuation,
        forward: +item.data.forward
      });
    });

    return arr;
  }

  const getTradeIdPayload = (data) => {
    var arr = [];
    data.map(item => {
      if(isNaN(item.data.tradeid) || isNaN(item.data.valuation))
        return false;

      arr.push(+item.data.tradeid);
    });

    return arr;
  }

  const checkDuplicatedTimeFrame = (payload) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/submission/check-time-frame', {
          items: JSON.stringify(payload)
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
        .post('/api/submission', {
            items: JSON.stringify(payload)
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
      let duplicates = await checkDuplicatedTimeFrame(tradeIds);
      console.log('duplicated items: ', duplicates)
      if(duplicates > 0) {
        setShowConfirmModal(true);
        dispatch(setLoading(false));
        return false;
      }
      // Save into database
      let payload = getSubmissionPayload(csvData);
      let saved = await saveToDatabase(payload);
      toggleSnackBar('success', saved);
      setIsReset(prev => !prev);
      dispatch(setLoading(false));
    } catch (err) {
      toggleSnackBar('error', err[0]);
      setIsReset(prev => !prev);
      dispatch(setLoading(false));
    }
  }

  const saveConfirmed = async () => {
    setShowConfirmModal(false);
    dispatch(setLoading(true));
    try {
      // Save into database
      let payload = getSubmissionPayload(csvData);
      let saved = await saveToDatabase(payload);
      toggleSnackBar('success', saved);
    } catch (err) {
      toggleSnackBar('error', err[0]);
    } finally {
      setIsReset(prev => !prev);
      dispatch(setLoading(false));
    }
  }
    
  return (
    <Root
      contentToolbar={
        <Typography variant="subtitle1" mt={4} component={'span'}>
          Submit a CSV file of your own valuation
        </Typography>
      }
      content={
        <Box className="p-8">
          <FileUploader 
            setCsvData={setCsvData} 
            isReset={isReset}
          />
          <Box className="mt-12 flex justify-center">
            <LoadingButton
              onClick={handleSaveClick}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              color="success"
              disabled={!csvData}
            >
              Save
            </LoadingButton>
          </Box>
            
          <ConfirmModal
            title={''}
            open={showConfirmModal}
            setOpen={setShowConfirmModal}
            handleClickOk={saveConfirmed}
          >
            <Typography variant="subtitle1" textAlign={'center'} display={'block'} component={'span'}>
              Valuation duplicates found for several trades.
            </Typography>
            <Typography variant="subtitle1" textAlign={'center'} display={'block'} component={'span'}>
              If you continue, you'll lose old values.
            </Typography>
            <Typography variant="subtitle1" textAlign={'center'} display={'block'} component={'span'}>
              Are you sure to proceed?
            </Typography>
          </ConfirmModal>
        </Box>
      }
    />
  );
}

export default SubmissionsPage;
