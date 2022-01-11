import React, { useState } from 'react';

const DragAndDrop = ({ onDrop, children, className, style }) => {
    const [classname, setClassname] = useState('border-slate-400');

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDrop(e.dataTransfer);
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setClassname('border-black');
    }

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setClassname('border-slate-400');
    }

    const handleOnClick = (e) => {
        if (document.getElementById('react-csv-reader')) {
            document.getElementById('react-csv-reader').click();
        }
    }

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onMouseEnter={handleDragEnter}
            onMouseLeave={handleDragLeave}
            onClick={handleOnClick}
            style={style}
            className={className + ' ' + classname}
        >
            {children}
        </div>
    )
}

export default DragAndDrop;