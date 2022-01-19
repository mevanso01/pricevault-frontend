import React, { useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from './../store/submissionSlice';

import FileUploader from 'app/shared-components/FileUploader';
import ToastrBar from 'app/shared-components/ToastrBar';
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
    const [snackBar, setSnackBar] = useState({
        isOpen: false,
        msg: '',
        type: 'success'
    });
    const [showConfirmModal, setShowConfirmModal] = useState(false);

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
            setSnackBar({
                isOpen: true,
                type: 'success',
                msg: saved
            });
            setIsReset(prev => !prev);
            dispatch(setLoading(false));
        } catch (err) {
            setSnackBar({
                isOpen: true,
                type: 'error',
                msg: err[0]
            });
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
            setSnackBar({
                isOpen: true,
                type: 'success',
                msg: saved
            });
        } catch (err) {
            setSnackBar({
                isOpen: true,
                type: 'error',
                msg: err[0]
            });
        } finally {
            setIsReset(prev => !prev);
            dispatch(setLoading(false));
        }
    }

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar({
            isOpen: false,
            type: 'success',
            msg: ''
        });
    };
    
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
                    <ToastrBar
                        open={snackBar.isOpen}
                        message={snackBar.msg}
                        severity={snackBar.type}
                        handleClose={handleSnackClose}
                    />
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
