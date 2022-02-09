import { useState } from 'react';
import { useSelector } from 'react-redux';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import AboutTab from './tabs/AboutTab';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-topBg': {
    background: 'url("assets/images/profile/morain-lake.jpg")!important',
    backgroundSize: 'cover!important',
    backgroundPosition: 'center center!important',
  },

  '& .FusePageSimple-header': {
    background: 'none',
    height: 320,
    minHeight: 320,
    [theme.breakpoints.down('lg')]: {
      height: 240,
      minHeight: 240,
    },
  },

  '& .FusePageSimple-wrapper': {
    background: 'transparent',
  },

  '& .FusePageSimple-content': {
    width: '100%',
    maxWidth: 1120,
    margin: 'auto',
  },

  '& .FusePageSimple-toolbar': {
    width: '100%',
    maxWidth: 1120,
    margin: 'auto',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'auto',
    height: 'auto',
    aliginItesm: 'flex-start',
  },
}));

const ProfilePage = () => {
  const user = useSelector(({ auth }) => auth.user);

  return (
    <Root
      header={<></>}
      contentToolbar={
        <>
          <div className="w-full px-24 pb-8 flex flex-col md:flex-row flex-1 items-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.1 } }}>
              <Avatar
                sx={{
                  borderWidth: 4,
                  borderStyle: 'solid',
                  borderColor: 'background.default',
                }}
                className="-mt-64  w-128 h-128"
                src="assets/images/avatars/user.png"
              />
            </motion.div>
            <div className="flex flex-col md:flex-row flex-1 items-center justify-between p-8">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              >
                <Typography
                  className="md:px-16 text-24 md:text-32 font-semibold tracking-tight"
                  variant="h4"
                  color="inherit"
                >
                  {user.data.displayName}
                </Typography>
              </motion.div>
            </div>
          </div>
        </>
      }
      content={
        <div className="p-16 sm:p-24">
          <AboutTab />
        </div>
      }
    />
  );
}

export default ProfilePage;
