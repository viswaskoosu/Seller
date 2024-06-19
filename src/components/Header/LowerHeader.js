// LowerHeader.js

import React, { useState, useEffect, useContext } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import CompanyLogo from './companyLogo.png';
import { Box, IconButton, Typography, Badge } from '@mui/material';
import {
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { StateContext, actionTypes } from '../../StateProvider'; // Adjust the path based on your folder structure

const LowerHeader = () => {
  const [state, dispatch] = useContext(StateContext);
  const { basket, favouriteItems, user } = state;
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null); // Modify as per your state structure
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedAddress(
      user && user.currentAddress !== undefined && user.currentAddress !== -1
        ? user.addresses[user.currentAddress]
        : null
    );
  }, [user.addresses]);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 800);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleAddressChange = (address) => {
    setSelectedAddress(address);
    handleMenuClose();
  };

  const handleAddNewAddress = () => {
    navigate('/addresses');
    handleMenuClose();
  };

  const logout = () => {
    // Example logout functionality
    console.log('Logout logic here');
    // Dispatch logout action to reset state
    dispatch({ type: actionTypes.USER_LOGOUT });
    // Redirect to home or login page after logout
    navigate('/');
  };

  return (
    <div className="lowerHeader" style={{ display: 'flex' }}>
      {/* JSX for the lower header component */}
    </div>
  );
};

export default LowerHeader;
