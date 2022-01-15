import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CSVReader } from 'react-papaparse';

const FileUploader = (props) => {
    const { setCsvData, isReset } = props;

    const [styles, setStyles] = useState({
        borderColor: '#cfcece',
        textColor: '#959595'
    });

    const handleOnDrop = (data) => {
        setCsvData(data);
    };

    const handleMouseEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setStyles({
            borderColor: '#111827',
            textColor: '#111827'
        });
    }

    const handleMouseLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setStyles({
            borderColor: '#cfcece',
            textColor: '#959595'
        });
    }

    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    };

    const handleOnRemoveFile = (data) => {
        setCsvData(data);
    };

    const papaparseOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
    };

    return (
        <Box 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <CSVReader
                addRemoveButton
                onDrop={handleOnDrop}
                onError={handleOnError}
                onRemoveFile={handleOnRemoveFile}
                isReset={isReset}
                config={papaparseOptions}
                style={{
                    dropArea: {
                        padding: '30px',
                        borderColor: styles.borderColor,
                        borderRadius: '10px'
                    }
                }}
            >
                <Typography 
                    variant="subtitle2" 
                    component="span" 
                    style={{color: styles.textColor}}
                >
                    Drag & Drop or Click to upload.
                </Typography>
            </CSVReader>
        </Box>
    );
}

export default FileUploader;