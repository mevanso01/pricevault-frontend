import React, { useState } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import InstrumentsHeader from './InstrumentsHeader';
import InstrumentsTable from './InstrumentsTable';
import FuseModal from 'app/shared-components/FuseModal';
import InstrumentForm from './InstrumentForm';

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

const InstrumentsItem = (props) => {
  const [openNewInstrumentModal, setOpenNewInstrumentModal] = useState(false);

  return (
    <Root 
      header={
        <InstrumentsHeader openNewInstrumentModal={() => setOpenNewInstrumentModal(true)} />
      } 
      content={
        <>
          <InstrumentsTable/>

          {/* Create New Instrument Modal */}
          <FuseModal
            title={'Create a New Instrument Type'}
            openModal={openNewInstrumentModal}
            closeModal={() => setOpenNewInstrumentModal(false)}
          >
            <InstrumentForm closeModal={() => setOpenNewInstrumentModal(false)} />
          </FuseModal>
        </>
      } 
      innerScroll 
    />
  );
}

export default InstrumentsItem;