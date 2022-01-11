import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Box from '@mui/material/Box';
import FileUploader from 'app/shared-components/FileUploader';

const Root = styled(FusePageSimple)({
  '& .FusePageSimple-header': {display: 'none'},
  '& .FusePageSimple-toolbar': {},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
});

function SubmissionsPage(props) {
    const [csvData, setCsvData] = useState([]);

    return (
        <Root
            contentToolbar={
                <Box></Box>
            }
            content={
                <Box className="p-8">
                    <FileUploader setCsvData={setCsvData} />
                </Box>
            }
        />
    );
}

export default SubmissionsPage;
