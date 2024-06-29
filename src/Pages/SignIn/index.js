import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useStateValue } from "../../Context/StateProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingPage from "../LoadingPage";
import {actionTypes} from '../../reducer'
const SignIn = () => {
    const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [{ userLoggedIn, favouriteItems, basket }, dispatch] = useStateValue();
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (userLoggedIn) {
      navigate("/account");
    }
  }, [userLoggedIn, navigate]);

  const removeErrorMessage = (e) => {
    if (e.target.id === "email") {
      setEmailError(false);
    }
    if (e.target.id === "password") {
      setPasswordError(false);
    }
  };

  const checkForm = (data) => {
    let check = false;
    const emailregex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailregex.test(data.get("email"))) {
      setEmailError("Invalid email");
      check = true;
    } else {
      setEmailError(false);
    }
    if (data.get("password").length === 0) {
      check = true;
      setPasswordError("Invalid password");
    } else {
      setPasswordError(false);
    }
    return check;
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (checkForm(data)) return;

    const userData = {
      email: data.get("email"),
      password: data.get("password"),
      isSeller: true,
    };

    setIsLoading(true);
    await axios
      .post(`${process.env.REACT_APP_API_URL}/user/login`, userData)
      .then((response) => {
        // if (response.data.success) {
          localStorage.setItem("user", JSON.stringify({token: response.data.user.token}));
          toast.success("Signed in successfully");
          dispatch({ type: actionTypes.USER_LOGIN });
          dispatch({ type: actionTypes.SET_USER, user: response.data.user });
          if (response.data.products) {
            dispatch({ type: actionTypes.SET_PRODUCTS, products: response.data.products });
          }
          navigate("/");
        // }
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.error) {
          toast.error("Couldn't sign in " + error.response.data.error);
        } else {
          toast.error("Couldn't sign in (Server error)");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (isLoading? <LoadingPage/>:
    <div>
      <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
                <LockOutlinedIcon />
              </Avatar> */}
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoFocus
                  inputProps={{ type: "email" }}
                  error={!!emailError}
                  helperText={emailError}
                  onChange={removeErrorMessage}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={!!passwordError}
                  helperText={passwordError}
                  onChange={removeErrorMessage}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: 'primary',
                    color: "#000000",
                  }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <RouterLink to="/forgotpassword" component={Link} variant="body2">
                      Forgot password?
                    </RouterLink>
                  </Grid>
                  <Grid item>
                    <RouterLink to="/signup" component={Link} variant="body2">
                      {"Don't have an account? Sign Up"}
                    </RouterLink>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
    </div>
  );
};

export default SignIn;
