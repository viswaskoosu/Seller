import React, { useState, useEffect } from 'react';
import './AccountPage.css';
import Default from './default.png';
import USER from './user.png';
// import Contact from './contact.png';
import { Link, useNavigate } from 'react-router-dom';
import { useStateValue } from '../../Context/StateProvider';
import { AccountCircle, Equalizer, ShoppingCart, History, Mail, Payment, LocationOn, ContactSupport } from '@mui/icons-material';

function SellerAccountPage() {
  const [{ user }, dispatch] = useStateValue();
  const [image, setImage] = useState(""); 
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({
      type: "USER_LOGOUT",
    });
    navigate('/signin');
  };

  const checkDP = () => {
    if (user) {
      if (user.photoURL && user.photoURL.includes("https")) {
        setImage(user.photoURL);
      } else if (user.photoURL && user.photoURL.includes("http")) {
        const newImage = user.photoURL.replace(/^http:\/\//i, "https://");
        setImage(newImage);
      } else {
        setImage(Default);
      }
    } else {
      setImage(Default);
    }
  };

  useEffect(() => {
    checkDP();
  }, [user]);

  return (
    <>
      <div className="profile-section" style={{ height: user ? 'fit-content' : '70vh' }}>
        <div className={`account-section ${user ? 'animate' : ''}`}>
          <div className="top-section">
            <p className="welcome-mssg">{user ? `Welcome, ${user.displayName}` : ""}</p>
          </div>
          <div className="account-section2">
            <div className="left-account-section">
              <img src={image} className="profile-img" alt="Profile" />
              <p className="profile-name">{user ? `${user.displayName}` : ""}</p>
              <p className="profile-email">{user ? `${user.email}` : ""}</p>
              <button
                onClick={logout}
                className="signout-btn"
              >
                Sign out
              </button>
            </div>
            <div className="right-account-section">
              <p className="personal-info-head">Personal Information</p>
              <p className="personal-info-desc">
                Manage your personal information, including your contact details.
              </p>
              <div className="personal-user-data">
                <div className="personal-name">
                  <div className="name-section">
                    <p className="name-data">Name</p>
                    <AccountCircle style={{ color: '#1976d2' }} />
                  </div>
                  <p className="users-name">{user ? `${user.displayName}` : ""}</p>
                </div>
                <Link to="/seller-dashboard" className="accountPage_section">
                  <div>
                  <div className="name-section">
                  <h3>Seller Statistics</h3>
                  <Equalizer style={{ color: '#1976d2' }} />
                  </div>
                    <p>View your sales performance</p>
                  </div>
                </Link>
                <Link to='/your-products' className="accountPage_section">
                  <div>
                  <div className="name-section">
                  <h3>Your Products</h3>
                  <ShoppingCart style={{ color: '#1976d2' }} />
                  </div>
                    <p>View and manage the products you're selling</p>
                  </div>
                </Link>
                <Link to="/selling-history" className="accountPage_section">
                  <div>
                  <div className="name-section">
                  <h3>Selling History</h3>
                  <History style={{ color: '#1976d2' }} />
                  </div>
                    <p>Review your past sales and earnings</p>
                  </div>
                </Link>
                <Link to="/seller-contact-info" className="accountPage_section">
                  <div className="contact-info">
                    <div className="mail-section">
                      <p className="mail-data">Contact Information</p>
                      <Mail style={{ color: '#1976d2' }} />
                    </div>
                    <div>
                      <p>{user && user.email ? user.email : "Please update your Email"}</p>
                      <p>{user && user.phone ? user.phone : "Please update your Mobile Number"}</p>
                      <p>{user && user.addresses && user.addresses.length > 0 ? `${user.addresses[0].street}, ${user.addresses[0].city}, ${user.addresses[0].state}, ${user.addresses[0].zip}, ${user.addresses[0].country}` : ""}</p>
                    </div>
                  </div>
                </Link>
                <Link to="/payment-methods" className="accountPage_section">
                  <div>
                  <div className="name-section">
                  <h3>Payment Methods</h3>
                  <Payment style={{ color: '#1976d2' }} />
                  </div>
                    {user && user.paymentMethods && user.paymentMethods.length > 0 ? (
                      <ul className="accountPage_list">
                        {user.paymentMethods.map((method) => (
                          <li key={method.id}>
                            <p>{method.type} ending in {method.last4} (Expires {method.expiration})</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No payment methods saved.</p>
                    )}
                  </div>
                </Link>
                <Link to="/seller-addresses" className="accountPage_section">
                  <div>
                  <div className="name-section">
                  <h3>Your Addresses</h3>
                  <LocationOn style={{ color: '#1976d2' }} />
                  </div>
                    <p>Edit addresses and add new ones</p>
                  </div>
                </Link>
                <Link to="/contact-us" className="accountPage_section">
                  <div>
                  <div className="name-section">
                  <h3>Contact Us</h3>
                  <ContactSupport style={{ color: '#1976d2' }} />
                  </div>
                    <p>Get in touch with us</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SellerAccountPage;
