import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ConfirmModal = (props) => {
  const {
    title,
    children,
    open,
    setOpen,
    handleClickOk,
    handleClickCancel
  } = props;

  const handleClose = () => {
    setOpen(false);
    if (handleClickCancel){
      handleClickCancel();
    }
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus variant="contained" color="success" onClick={handleClickOk}>
          Continue
        </Button>
        <Button onClick={handleClose} variant="contained" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmModal;