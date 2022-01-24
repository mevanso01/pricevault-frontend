import React from 'react';
import useState from 'react-usestateref'; // additional package for assigning state value as soon as possible
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { closeDialog, openDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
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
  const [invalidPayload, setInvalidPayload, refInvalidPayload] = useState([]);
  const [showInvalidConfirmModal, setShowInvalidConfirmModal] = useState(false);

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

  const getSubmissionPayload = (data, invalidIds=[]) => {
    var arr = [];
    data.map(item => {
      if(isNaN(item.data.tradeid) || isNaN(item.data.valuation))
        return false;
      if (invalidIds.includes(item.data.tradeid) || invalidIds.includes(+item.data.tradeid))
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

  const checkValidate = (payload) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/submission/check-validate', {
          items: JSON.stringify(payload)
        })
        .then((response) => {
          const { data } = response;
          if (data.success) {
            resolve(data.result);
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
      // Check if duplicated data and trade id validation
      let tradeIds = getTradeIdPayload(csvData);
      let validate = await checkValidate(tradeIds);
      console.log('validate result: ', validate);
      setInvalidPayload(validate?.invalid_ids);
      
      // Open time frame duplicated confirm modal
      if (validate.tf_duplicates_ids && validate.tf_duplicates_ids.length > 0) {
        dispatch(openDialog({
          children: (
            <React.Fragment>
              <DialogContent>
                <Typography variant="subtitle1" textAlign={'center'} display={'block'} component={'span'}>
                  Valuation duplicates found for several trades.
                </Typography>
                <Typography variant="subtitle1" textAlign={'center'} display={'block'} component={'span'}>
                  If you continue, you'll lose old values.
                </Typography>
                <Typography variant="subtitle1" textAlign={'center'} display={'block'} component={'span'}>
                  Are you sure to proceed?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => timeFrameConfirmed()} variant="contained" color="success" autoFocus>
                  Continue
                </Button>
                <Button onClick={() => { dispatch(closeDialog()); setIsReset(prev => !prev); }} variant="contained">
                  Cancel
                </Button>
              </DialogActions>
            </React.Fragment>
          )
        }));
        dispatch(setLoading(false));
        return false;
      }
      
      // Open trade id validation confirm modal
      if (validate.invalid_ids && validate.invalid_ids.length > 0) {
        setShowInvalidConfirmModal(true);
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

  const timeFrameConfirmed = async () => {
    dispatch(closeDialog());
    dispatch(setLoading(true));
    try {
      // Open trade id validation confirm modal
      if (refInvalidPayload.current.length > 0) {
        setShowInvalidConfirmModal(true);
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
    setShowInvalidConfirmModal(false);
    dispatch(setLoading(true));
    try {
      // Save into database
      let payload = getSubmissionPayload(csvData, refInvalidPayload.current);
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
            open={showInvalidConfirmModal}
            setOpen={setShowInvalidConfirmModal}
            handleClickOk={saveConfirmed}
            handleClickCancel={() => setIsReset(prev => !prev)}
          >
            <Typography variant="subtitle1" textAlign={'center'} display={'block'} component={'span'}>
              Some valuations have invalid trades.
            </Typography>
            <Typography variant="subtitle1" textAlign={'center'} display={'block'} component={'span'}>
              If you continue, they'll be filtered out.
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
