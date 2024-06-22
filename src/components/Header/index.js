import * as React from 'react';
import { AppBar, Box, Toolbar, IconButton, Button, InputBase, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import CompanyLogo from './companyLogo.png';
import "./Header.css";
import ProductsIcon from '@mui/icons-material/Category';
import HistoryIcon from '@mui/icons-material/History';
import AccountIcon from '@mui/icons-material/AccountCircle';
import StatisticsIcon from '@mui/icons-material/BarChart';

const mainSections = [
  { label: 'Your Products', link: '/your-products', icon: <ProductsIcon /> },
  { label: 'Selling History', link: '/selling-history', icon: <HistoryIcon /> },
  { label: 'Account', link: '/account', icon: <AccountIcon /> },
  { label: 'Statistics', link: '/seller-statistics', icon: <StatisticsIcon /> },
];

function Header() {
  const [anchorElNav] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/search-results/${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="100%" sx={{ overflowX: { xs: 'visible', sm: 'hidden' } }}>
        <Toolbar disableGutters>
          <Link to="/">
            <img
              className="header_logo"
              src={CompanyLogo}
              alt="logo"
            />
          </Link>
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              alignItems: "center",
              ml: 1,
              minWidth: 0,
            }}
          >
            <InputBase
              placeholder="Search for Your Products"
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              sx={{
                color: "black",
                backgroundColor: "white",
                borderRadius: 1,
                pl: 2,
                pr: 2,
                width: "100%",
              }}
            />
            <IconButton type="submit" sx={{ p: "10px", ml: 1 }} onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            {mainSections.map((section) => (
              <Button
                key={section.label}
                component={Link}
                to={section.link}
                startIcon={section.icon}
                sx={{ ml: 1, color: 'inherit', display: { xs: 'none', md: 'flex' } }}
              >
                {section.label}
              </Button>
            ))}
            {mainSections.map((section) => (
              <IconButton
                key={section.label}
                component={Link}
                to={section.link}
                sx={{ ml: 1, color: 'inherit', display: { xs: 'flex', md: 'none' } }}
              >
                {section.icon}
              </IconButton>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
