import React from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUpload = ({handleFileUpload}) => {

  return (
    <div>
      <input
        accept="image/*"
        id="file-upload"
        type="file"
        onChange={handleFileUpload}
        multiple
        style={{ display: 'none' }}
      />
      <label htmlFor="file-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon fontSize="large" />}
          sx={{ mb: 2, mr: 2 }} // Adding margin bottom and right using sx prop
        >
          Add Images
        </Button>
      </label>
      {/* <Button
        variant="outlined"
        color="primary"
        onClick={uploadFiles}
        sx={{ mb: 2, mr: 2 }}
      >
        Upload
      </Button> */}
    </div>
  );
};

export default FileUpload;
