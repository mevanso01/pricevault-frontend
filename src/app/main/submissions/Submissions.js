import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import FileUploader from 'app/shared-components/FileUploader';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const Root = styled(FusePageSimple)({
  '& .FusePageSimple-header': {display: 'none'},
  '& .FusePageSimple-toolbar': {justifyContent: 'center'},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
});

function SubmissionsPage(props) {
    const user = useSelector(({ auth }) => auth.user);

    const [csvData, setCsvData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [snackBar, setSnackBar] = useState({
        isOpen: false,
        msg: ''
    });

    const convertToPayload = (data) => {
        var arr = [];
        data.map(item => {
            if(isNaN(item.data.tradeid) || isNaN(item.data.valuation))
                return false;

            arr.push({
                tradeId: +item.data.tradeid,
                valuation: +item.data.valuation,
                forward: +item.data.forward,
                userId: user.data.id
            });
        });

        return arr;
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

    const handleSaveClick = () => {
        if(!csvData) return false;
        let payload = convertToPayload(csvData);

        setLoading(true);
        saveToDatabase(payload)
            .then((res) => {
                console.log(res);
                setSnackBar({
                    isOpen: true,
                    msg: res
                });
            })
            .catch((err) => {
                console.log(err);
                setSnackBar({
                    isOpen: true,
                    msg: 'err'
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
                    <Snackbar
                        anchorOrigin={{vertical:'bottom', horizontal:'right'}}
                        open={snackBar.isOpen}
                        autoHideDuration={5000}
                        onClose={handleSnackClose}
                        message={snackBar.msg}
                        sx={{ bottom: { xs: 80 } }}
                    />
                </Box>
            }
        />
    );
}

export default SubmissionsPage;
