import React, { useState } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import AssetsHeader from './AssetsHeader';
import AssetsTable from './AssetsTable';
import FuseModal from 'app/shared-components/FuseModal';
import AssetForm from './AssetForm';

const Root = styled(FusePageCarded)(({ theme }) => ({
  '& .FusePageCarded-header': {
    minHeight: 72,
    height: 72,
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      minHeight: 136,
      height: 136,
    },
  },
  '& .FusePageCarded-content': {
    display: 'flex',
  },
  '& .FusePageCarded-contentCard': {
    overflow: 'hidden',
  },
}));

const AssetsItem = (props) => {
  const [openNewAssetModal, setOpenNewAssetModal] = useState(false);

  return (
    <Root 
      header={
        <AssetsHeader openNewAssetModal={() => setOpenNewAssetModal(true)} />
      } 
      content={
        <>
          <AssetsTable/>

          {/* Create New Asset Modal */}
          <FuseModal
            title={'Create a New Asset'}
            openModal={openNewAssetModal}
            closeModal={() => setOpenNewAssetModal(false)}
          >
            <AssetForm closeModal={() => setOpenNewAssetModal(false)} />
          </FuseModal>
        </>
      } 
      innerScroll 
    />
  );
}

export default AssetsItem;