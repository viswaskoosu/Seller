import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import CompanyLogo from './companyLogo.png';
import "./Header.css";
import { MenuItem } from '@mui/material';

const mainSections = [
  { label: 'Your Products', link: '/your-products' },
  { label: 'Selling History', link: '/selling-history' },
  { label: 'Account', link: '/account' },
  { label: 'Statistics', link: '/seller-statistics' },
];

const pages = ['Products', 'Pricing', 'Blog']; // General pages

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // Implement search logic here if needed
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/">
            <img
              className="header_logo"
              src={CompanyLogo}
              alt="logo"
            />
          </Link>

          {/* Search Bar */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <TextField
              id="search"
              label="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: (
                  <IconButton
                    type="submit"
                    aria-label="search"
                    sx={{ p: '10px' }}
                  >
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>

          {/* Main Sections */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            {mainSections.map((section) => (
              <Button
                key={section.label}
                component={Link}
                to={section.link}
                sx={{ ml: 2, color: 'inherit' }}
              >
                {section.label}
              </Button>
            ))}
          </Box>

          {/* Navigation Menu (for mobile) */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
