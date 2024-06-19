import * as React from 'react';
import { useState } from 'react';
import {
  Box, Button, Container, LinearProgress, TextField, Typography, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';

const SignUp = () => {
  const [stage, setStage] = useState(1);
  const [progress, setProgress] = useState(33);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [address, setAddress] = useState('');

  const handleNextStage = () => {
    setStage(stage + 1);
    setProgress(progress + 33);
  };

  const handlePreviousStage = () => {
    setStage(stage - 1);
    setProgress(progress - 33);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress variant="determinate" value={progress} />
      </Box>
      <Box sx={{ mt: 4 }}>
        {stage === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Stage 1: Enter Your Phone Number
            </Typography>
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleNextStage}>
                Next
              </Button>
            </Box>
          </Box>
        )}
        {stage === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Stage 2: Tell us about your business
            </Typography>
            <TextField
              fullWidth
              label="Amazon Store Name"
              variant="outlined"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" sx={{ mb: 2 }}>
              Check Availability
            </Button>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Select Product Category</InputLabel>
              <Select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                label="Select Product Category"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Category1">Category 1</MenuItem>
                <MenuItem value="Category2">Category 2</MenuItem>
                <MenuItem value="Category3">Category 3</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Business Address"
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" onClick={handlePreviousStage}>
                Back
              </Button>
              <Button variant="contained" onClick={handleNextStage}>
                Continue
              </Button>
            </Box>
          </Box>
        )}
        {stage === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Stage 3: Review and Submit
            </Typography>
            <Typography variant="body1" gutterBottom>
              Phone Number: {phoneNumber}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Amazon Store Name: {businessName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Product Category: {productCategory}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Business Address: {address}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" onClick={handlePreviousStage}>
                Back
              </Button>
              <Button variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SignUp;
