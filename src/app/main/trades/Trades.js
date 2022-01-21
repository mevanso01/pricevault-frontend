import React from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { ROLE } from 'app/auth/Auth';
import TradeAdmin from './Trade.admin';
import TradeUser from './Trade.user';

const Root = styled(FusePageSimple)({
  '& .FusePageSimple-header': {display: 'none'},
  '& .FusePageSimple-toolbar': {justifyContent: 'center'},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
});

const TradesPage = () => {

  const authRole = useSelector(({ auth }) => auth.user.role);
  
  return (
    <Root
      content={
        authRole == ROLE.admin ? <TradeAdmin /> : <TradeUser />
      }
    />
  );
}

export default TradesPage;
