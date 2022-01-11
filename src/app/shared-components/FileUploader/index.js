import React, { useState } from 'react';
import CSVReader from "react-csv-reader";
import Box from '@mui/material/Box';
import DragAndDrop from './../DragAndDrop';

const FileUploader = (props) => {
    const { setCsvData } = props;

	const handleForce = (data, fileInfo) => {
        console.log(data, fileInfo);
        setCsvData(data);
    }

    const handleError = (e) => console.log('Error: ', e);

    const handleDroppedFiles = (file) => {
        console.log("dropped.", file);
        // document.getElementById('react-csv-reader').value = file;
        const element = document.getElementById('react-csv-reader');
        element.addEventListener('change', () => console.log('change'));
        const event = new Event('change');  
        element.dispatchEvent(event);
    }

    const papaparseOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
    };
	
    return (
        <Box className="">
            <CSVReader
                accept=".csv"
                cssClass="react-csv-input"
                onFileLoaded={handleForce}
                onError={handleError}
                parserOptions={papaparseOptions}
                inputId="react-csv-reader"
                inputStyle={{ display: 'none' }}
            />
            <DragAndDrop 
                onDrop={dataTransfer => handleDroppedFiles(dataTransfer.files)} 
                accept='.csv' 
                className='drag-drop-file-uploader w-full text-center p-32 border-2 border-dashed cursor-pointer'
            >
                {'Drag & Drop files or click to select'}
            </DragAndDrop>
        </Box>
    );
}

export default FileUploader;
