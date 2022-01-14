import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import FileUploader from 'app/shared-components/FileUploader';
import ToastrBar from 'app/shared-components/ToastrBar';
import axios from 'axios';

const Root = styled(FusePageSimple)({
  '& .FusePageSimple-header': {display: 'none'},
  '& .FusePageSimple-toolbar': {justifyContent: 'center'},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
});

const SubmissionsPage = (props) => {
    const [csvData, setCsvData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [snackBar, setSnackBar] = useState({
        isOpen: false,
        msg: '',
        type: 'success'
    });

    const convertToPayload = (data) => {
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

    const checkDuplicatedTimeState = (payload) => {
        return new Promise((resolve, reject) => {
            axios
                .post('/api/submission/checkTimeState', {
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

        setLoading(true);
        let payload = convertToPayload(csvData);
        let tradeIds = getTradeIdPayload(csvData)

        // Check if duplicated data is in there
        let duplicates = await checkDuplicatedTimeState(tradeIds);
        console.log('duplicated items: ', duplicates)
        if(duplicates > 0) {
            if (!confirm("Valuation duplicates found for several trades. If you continue, you'll lose old values. Are you sure to proceed?")) {
                setIsReset(prev => !prev);
                setLoading(false);
                return false;
            }
        }

        saveToDatabase(payload)
            .then((res) => {
                console.log(res);
                setSnackBar({
                    isOpen: true,
                    type: 'success',
                    msg: res
                });
            })
            .catch((err) => {
                console.log(err);
                setSnackBar({
                    isOpen: true,
                    type: 'error',
                    msg: err[0]
                });
            })
            .finally(() => {
                setIsReset(prev => !prev);
                setLoading(false);
            });
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
                <Typography variant="subtitle1" component="h6" mt={4}>
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
                </Box>
            }
        />
    );
}

export default SubmissionsPage;
