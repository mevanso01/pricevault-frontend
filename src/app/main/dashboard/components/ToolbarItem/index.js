import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const ToolbarItem = (props) => {
    const { title, children } = props;

    return (
        <Stack direction="row" alignItems={'center'} spacing={1}>
            <Typography variant="subtitle1" component="div">
                {title}
            </Typography>
            {children}
        </Stack>
    );
}

export default ToolbarItem;