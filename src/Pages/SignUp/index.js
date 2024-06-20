import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  LinearProgress,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useLocation } from "react-router-dom";
import LoadingPage from "../LoadingPage";
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useStateValue } from "../../Context/StateProvider";
import axios from 'axios'
const SignUp = () => {
  const navigate = useNavigate();
  const [,dispatch] = useStateValue()
  const [isLoading, setIsLoading] = useState(false)
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(25);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [businessNameError, setBusinessNameError] = useState(false);
  const handleChange = (e) => {
    if (e.target.id === "email") {
      setEmail(e.target.value);
      setEmailError(false);
    }
    if (e.target.id === "firstName") {
      setFirstName(e.target.value);
      setFirstNameError(false);
    }
    if (e.target.id === "lastName") {
      setLastName(e.target.value);
      setLastNameError(false);
    }
    if (e.target.id === "password") {
      setPassword(e.target.value);
      setPasswordError(false);
    }
    if (e.target.id === "phoneNumber") {
      setPhoneNumber(e.target.value);
      setPhoneNumberError(false);
    }
    if (e.target.id === "address") {
      setAddress(e.target.value);
      setAddressError(false);
    }
    if (e.target.id === "businessName") {
      setBusinessName(e.target.value);
      setBusinessNameError(false);
    }
  };
  const checkForm = () => {
    let check = false;
    if (stage === 0) {
      const emailregex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailregex.test(email)) {
        setEmailError("Invalid email");
        check = check || true;
        // console.log(emailError)
      } else {
        setEmailError(false);
      }
      if (password.length < 6) {
        check = check || true;
        setPasswordError("Password must be atleast 6 characters");
      } else {
        setPasswordError(false);
      }
      if (firstName.length === 0) {
        check = check || true;
        setFirstNameError("Invalid name");
      } else {
        setFirstNameError(false);
      }
      if (lastName.length === 0) {
        check = check || true;
        setLastNameError("Invalid name");
      } else {
        setLastNameError(false);
      }
    }
    if (stage === 1) {
      if (!/^\d+$/.test(phoneNumber) || phoneNumber.length !== 10) {
        check = check || true;
        setPhoneNumberError("Invalid Phone Number");
      } else {
        setPhoneNumberError(false);
      }
    }
    if (stage === 2) {
      if (businessName.length === 0) {
        check = check || true;
        setBusinessNameError("Invalid Business Name");
      } else {
        setBusinessNameError(false);
      }
      if (address.length === 0) {
        check = check || true;
        setAddressError("Invalid Address");
      } else {
        setAddressError(false);
      }
    }
    return check;
  };
  const handleSubmit = async () => {
    const userData = {
      name: `${firstName} ${lastName}`,
      email: email,
      password: password,
      address: address,
      phone: phoneNumber,
      businessName: businessName,
      isSeller: true,
    };
    setIsLoading(true)
    await axios
      .post(`${process.env.REACT_APP_API_URL}/user/signup`, userData)
      .then((response) => {
        // console.log(response.data)
        // if (response.data.success)
          // Cookies.set("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Signed up successfully");
        dispatch({
          type: "USER_LOGIN",
        });
        dispatch({
          type: 'SET_USER',
          user: response.data.user
        })
        navigate("/");
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          toast.error("Couldn't signup " + error.response.data.error);
        } else toast.error("Couldn't sign up (Server error)");
      })
      .finally(() => {
        setIsLoading(false)
      });

  }
  const handleNextStage = () => {
    if (checkForm()) return;
    setStage(stage + 1);
    setProgress(progress + 25);
  };

  const handlePreviousStage = () => {
    setStage(stage - 1);
    setProgress(progress - 25);
  };
  // console.log(email, password, firstName, lastName)
  return (isLoading? <LoadingPage/>:
    <Container maxWidth="md">
      <Box sx={{ width: "100%", mt: 4 }}>
        <LinearProgress variant="determinate" value={progress} />
      </Box>
      <Box sx={{ mt: 4 }}>
        {stage === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Stage 0: Signup
            </Typography>
            <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    error={firstNameError}
                    helperText={firstNameError}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    error={lastNameError}
                    helperText={lastNameError}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    inputProps={{
                      type: "email",
                    }}
                    error={emailError}
                    helperText={emailError}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    error={passwordError}
                    helperText={passwordError}
                    onChange={handleChange}
                  />
                </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleNextStage}>
                Next
              </Button>
            </Box>
          </Box>
        )}
        {stage === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Stage 1: Enter Your Phone Number
            </Typography>
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              error={phoneNumberError}
              helperText={phoneNumberError}
              onChange={handleChange}
            />
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button variant="contained" onClick={handlePreviousStage}>
                Back
              </Button>
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
              id="businessName"
              value={businessName}
              error={businessNameError}
              helperText={businessNameError}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" sx={{ mb: 2 }}>
              Check Availability
            </Button>
            {/* <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
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
            </FormControl> */}
            <TextField
              fullWidth
              label="Business Address"
              variant="outlined"
              id="address"
              value={address}
              error={addressError}
              helperText={addressError}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
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
              Name: {firstName} {lastName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: {email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Password: {password}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Phone Number: {phoneNumber}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Amazon Store Name: {businessName}
            </Typography>
            {/* <Typography variant="body1" gutterBottom>
              Product Category: {productCategory}
            </Typography> */}
            <Typography variant="body1" gutterBottom>
              Business Address: {address}
            </Typography>
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button variant="contained" onClick={handlePreviousStage}>
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
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