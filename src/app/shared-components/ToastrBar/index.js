import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ToastrBar = (props) => {
    const {
        open, 
        message,
        severity,
        handleClose
    } = props;

    return (
        <Snackbar 
            anchorOrigin={{vertical:'top', horizontal:'right'}}
            open={open} 
            autoHideDuration={6000} 
            onClose={handleClose}
            sx={{ top: { xs: 140 } }}
        >
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default ToastrBar;