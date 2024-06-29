import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
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
import Link from "@mui/material/Link";
import { useLocation } from "react-router-dom";
import LoadingPage from "../LoadingPage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateValue } from "../../Context/StateProvider";
import axios from "axios";
import AddressTemplate from "./AddressTemplate";
import { displayError } from "../../Requests";
import OTPInput from "./OTP";
const SignUp = () => {
  const navigate = useNavigate();
  const [, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(25);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });
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
    // if (e.target.id === "address") {
    //   setAddress(e.target.value);
    //   setAddressError(false);
    // }
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
      if (!/^\d+$/.test(phoneNumber) || phoneNumber.length !== 10 || phoneNumber[0] === "0") {
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
      if (
        // address.name === "" ||
        address.street === "" ||
        address.city === "" ||
        address.state === "" ||
        address.zip === "" ||
        address.country === ""
      ) {
        check = check || true;
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
          setAddressErrors(validationErrors);
        } else {
          setAddressErrors(false);
        }
      }
    }
    return check;
  };
  const handleSubmit = async () => {
    const modifiedAddress = { ...address, id: Date.now(), name: businessName };
    const userData = {
      name: `${firstName} ${lastName}`,
      email: email,
      password: password,
      address: modifiedAddress,
      phone: phoneNumber,
      businessName: businessName,
      isSeller: true,
      otp: otp,
    };
    setIsLoading(true);
    await axios
      .post(`${process.env.REACT_APP_API_URL}/user/signup`, userData)
      .then((response) => {
        // console.log(response.data)
        // if (response.data.success)
        // Cookies.set("token", response.data.token)
        console.log(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Signed up successfully");
        dispatch({
          type: "USER_LOGIN",
        });
        dispatch({
          type: "SET_USER",
          user: response.data.user,
        });
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
        setIsLoading(false);
      });
  };
  const handleNextStage = () => {
    if (checkForm()) return;
    setStage(stage + 1);
    setProgress(progress + 25);
  };

  const handlePreviousStage = () => {
    setStage(stage - 1);
    setProgress(progress - 25);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleNextStage();
    }
  };
  const [addressErrors, setAddressErrors] = useState({});
  const [pinTimeout, setPinTimeout] = useState(null);
  const [manualCountry, setManualCountry] = useState(false);
  const countries = [
    "India",
    "United States",
    "Canada",
    "Australia",
    "United Kingdom",
    "Germany",
    "France",
    "Japan",
    "China",
    "Brazil",
    "South Africa",
  ];

  const validate = () => {
    let validationErrors = {};
    // if (!address.name) validationErrors.name = "Name is required";
    if (!address.street) validationErrors.street = "Street is required";
    if (!address.city) validationErrors.city = "City is required";
    if (!address.state) validationErrors.state = "State is required";
    if (!address.zip.match(/^\d{6}$/))
      validationErrors.zip = "Invalid PIN code";
    if (!address.country && !manualCountry)
      validationErrors.country = "Country is required";
    return validationErrors;
  };
  const fetchCityState = async (pin) => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pin}`
      );
      const data = await response.json();
      if (data[0].Status === "Success") {
        const { District, State } = data[0].PostOffice[0];
        setAddress((prevState) => ({
          ...prevState,
          city: District,
          state: State,
        }));
        setAddressErrors((prevErrors) => ({ ...prevErrors, zip: "" }));
      } else {
        setAddressErrors((prevErrors) => ({
          ...prevErrors,
          zip: "Invalid PIN code",
        }));
      }
    } catch (error) {
      console.error("Error fetching city and state:", error);
      setAddressErrors((prevErrors) => ({
        ...prevErrors,
        zip: "Error fetching data",
      }));
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value;

    if (value.match(/^\d{0,6}$/)) {
      setAddress({ ...address, zip: value });

      if (value.length === 6) {
        if (pinTimeout) {
          clearTimeout(pinTimeout);
        }
        setPinTimeout(setTimeout(() => fetchCityState(value), 500));
      } else {
        setAddressErrors((prevErrors) => ({
          ...prevErrors,
          zip: "Invalid PIN code",
        }));
      }
    }
  };
  const handleCountryChange = (e) => {
    const value = e.target.value;
    if (value === "Manual") {
      setManualCountry(true);
      setAddress({ ...address, country: "" });
    } else {
      setManualCountry(false);
      setAddress({ ...address, country: value });
    }
    setAddressErrors((prevErrors) => ({ ...prevErrors, country: "" }));
  };
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const sendOtp = () => {
    setIsLoading(true)
    axios
      .post(`${process.env.REACT_APP_API_URL}/user/sendotp`, {
        email: email,
      })
      .then(() => {
        toast.success("OTP SENT. Check Mail");
        setOtpMode(true);
      })
      .catch((e) => {
        displayError(e);
      })
      .finally(() => {
        setIsLoading(false)
      })
  };
  // console.log(email, password, firstName, lastName)
  return isLoading ? (
    <LoadingPage />
  ) : (
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
                  value={firstName}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
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
                  value={lastName}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
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
                  value={email}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
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
                  value={password}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
              sx={{ mb: 2 }}
            />
            {/* <Button variant="contained" sx={{ mb: 2 }}>
              Check Availability
            </Button> */}
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
            {/* <TextField
              fullWidth
              label="Business Address"
              variant="outlined"
              id="address"
              value={address}
              error={addressError}
              helperText={addressError}
              onChange={handleChange}
onKeyDown={handleKeyDown}
              sx={{ mb: 2 }}
            /> */}
            {/* <AddressTemplate address={address} setAddress={setAddress} handleKeyDown={handleKeyDown} /> */}
            <div className="address_form">
              {/* <input
                type="text"
                placeholder="Name"
                value={address.name}
                onChange={(e) => {
                  setAddress({ ...address, name: e.target.value });
                  setAddressErrors({ ...addressErrors, name: false });
                }}
                onKeyDown={handleKeyDown}
              />
              {addressErrors.name && (
                <span className="error">{addressErrors.name}</span>
              )} */}
              <input
                type="text"
                placeholder="Street"
                value={address.street}
                onChange={(e) => {
                  setAddress({ ...address, street: e.target.value });
                  setAddressErrors({ ...addressErrors, street: false });
                }}
                onKeyDown={handleKeyDown}
              />
              {addressErrors.street && (
                <span className="error">{addressErrors.street}</span>
              )}
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => {
                  setAddress({ ...address, city: e.target.value });
                  setAddressErrors({ ...addressErrors, city: false });
                }}
                onKeyDown={handleKeyDown}
              />
              {addressErrors.city && (
                <span className="error">{addressErrors.city}</span>
              )}
              <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) => {
                  setAddress({ ...address, state: e.target.value });
                  setAddressErrors({ ...addressErrors, state: false });
                }}
                onKeyDown={handleKeyDown}
              />
              {addressErrors.state && (
                <span className="error">{addressErrors.state}</span>
              )}
              <input
                type="text"
                placeholder="PIN Code"
                value={address.zip}
                onChange={handlePinChange}
              />
              {addressErrors.zip && (
                <span className="error">{addressErrors.zip}</span>
              )}
              <select
                value={manualCountry ? "Manual" : address.country}
                onChange={handleCountryChange}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
                <option value="Manual">Enter Manually</option>
              </select>
              {manualCountry && (
                <input
                  type="text"
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) => {
                    setAddress({ ...address, country: e.target.value });
                    setAddressErrors({ ...addressErrors, country: false });
                  }}
                  onKeyDown={handleKeyDown}
                />
              )}
              {addressErrors.country && (
                <span className="error">{addressErrors.country}</span>
              )}
              {/* <button className="save_button" onClick={handleSave}>
              Save
            </button> */}
              {/* <button
              className="cancel_button"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button> */}
            </div>
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
              Password: {"*".repeat(password.length)}
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
              Business Address: {address.street}, {address.city},{" "}
              {address.state}, {address.country}, {address.zip}
            </Typography>
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button variant="contained" onClick={handlePreviousStage}>
                Back
              </Button>
              
                <Button variant="contained" color="primary" onClick={sendOtp}>
                  {!otpMode? "Send OTP": "Resend OTP"}
                </Button>
              
            </Box>

            <div>
              {otpMode ? (
                <>
                  <OTPInput
                    separator={<span></span>}
                    otp={otp}
                    setOtp={setOtp}
                    length={6}
                  />
                  {/* <span>Entered value: {otp}</span> */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      bgcolor: "#007bff",
                      color: "#ffffff",
                    }}
                    onClick={handleSubmit}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <></>
              )}
            </div>
          </Box>
        )}
      </Box>
      <Grid item>
        <RouterLink to="/signin" component={Link} variant="body2">
          {"Already have an account? Signin"}
        </RouterLink>
      </Grid>
    </Container>
  );
};

export default SignUp;
