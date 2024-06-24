import React, { useState } from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUpload = ({ handleFileUpload }) => {
  const [key, setKey] = useState(0); // State to reset input key
  const handleInput = (e) => {
    handleFileUpload(e)
    setKey(key+1)
  }
  return (
    <div>
      <input
        key={key} // Reset input by changing its key
        accept="image/*"
        id="file-upload"
        type="file"
        onChange={handleInput}
        multiple
        style={{ display: 'none' }}
      />
      <label htmlFor="file-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon fontSize="large" />}
          sx={{ mb: 2, mr: 2 }}
        >
          Add Images
        </Button>
      </label>
    </div>
  );
};

export default FileUpload;
