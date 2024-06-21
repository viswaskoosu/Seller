import React, { useState } from "react";
import "./Addresses.css"; // Ensure this CSS file is in the correct path
import { useStateValue } from "../../Context/StateProvider";
import Header from "../../components/Header";

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

function Addresses() {
  const [{ user, userLoggedIn }, dispatch] = useStateValue();
  const [editMode, setEditMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });
  const [errors, setErrors] = useState({});
  const [pinTimeout, setPinTimeout] = useState(null);
  const [manualCountry, setManualCountry] = useState(false);

  const validate = () => {
    let validationErrors = {};
    if (!newAddress.name) validationErrors.name = "Name is required";
    if (!newAddress.street) validationErrors.street = "Street is required";
    if (!newAddress.city) validationErrors.city = "City is required";
    if (!newAddress.state) validationErrors.state = "State is required";
    if (!newAddress.zip.match(/^\d{6}$/))
      validationErrors.zip = "Invalid PIN code";
    if (!newAddress.country && !manualCountry)
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
        setNewAddress((prevState) => ({
          ...prevState,
          city: District,
          state: State,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, zip: "" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, zip: "Invalid PIN code" }));
      }
    } catch (error) {
      console.error("Error fetching city and state:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        zip: "Error fetching data",
      }));
    }
  };

  const handleEdit = (address) => {
    setEditMode(true);
    setCurrentAddress(address);
    setNewAddress({ ...address });
  };

  const handleDelete = (addressId) => {
    // Remove address logic here
    dispatch({
      type: "DELETE_ADDRESS",
      addressId: addressId,
    });
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (currentAddress) {
      // Update address logic here
      dispatch({
        type: "EDIT_ADDRESS",
        address: { ...newAddress, id: currentAddress.id },
      });
    } else {
      const newAddressWithId = { ...newAddress, id: Date.now().toString() };
      // Add address logic here
      dispatch({
        type: "ADD_ADDRESS",
        address: newAddressWithId,
      });
    }

    setEditMode(false);
    setCurrentAddress(null);
    setNewAddress({
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
    });
    setErrors({});
    setManualCountry(false);
  };

  const handlePinChange = (e) => {
    const value = e.target.value;

    if (value.match(/^\d{0,6}$/)) {
      setNewAddress({ ...newAddress, zip: value });

      if (value.length === 6) {
        if (pinTimeout) {
          clearTimeout(pinTimeout);
        }
        setPinTimeout(setTimeout(() => fetchCityState(value), 500));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, zip: "Invalid PIN code" }));
      }
    }
  };

  const handleCountryChange = (e) => {
    const value = e.target.value;
    if (value === "Manual") {
      setManualCountry(true);
      setNewAddress({ ...newAddress, country: "" });
    } else {
      setManualCountry(false);
      setNewAddress({ ...newAddress, country: value });
    }
    setErrors((prevErrors) => ({ ...prevErrors, country: "" }));
  };

  return (
    <>
      {/* <Header /> */}
      <div className="addresses">
        <div className="header">
          <h2>Manage Your Addresses</h2>
          <button
            className="add_address"
            onClick={() => {
              setEditMode(true);
              setCurrentAddress(null);
              setNewAddress({
                name: "",
                street: "",
                city: "",
                state: "",
                zip: "",
                country: "India",
              });
            }}
          >
            Add New Address
          </button>
        </div>

        {editMode ? (
          <div className="address_form">
            <input
              type="text"
              placeholder="Name"
              value={newAddress.name}
              onChange={(e) =>
                setNewAddress({ ...newAddress, name: e.target.value })
              }
            />
            {errors.name && <span className="error">{errors.name}</span>}
            <input
              type="text"
              placeholder="Street"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
            />
            {errors.street && <span className="error">{errors.street}</span>}
            <input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
            />
            {errors.city && <span className="error">{errors.city}</span>}
            <input
              type="text"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
            />
            {errors.state && <span className="error">{errors.state}</span>}
            <input
              type="text"
              placeholder="PIN Code"
              value={newAddress.zip}
              onChange={handlePinChange}
            />
            {errors.zip && <span className="error">{errors.zip}</span>}
            <select
              value={manualCountry ? "Manual" : newAddress.country}
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
                value={newAddress.country}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, country: e.target.value })
                }
              />
            )}
            {errors.country && <span className="error">{errors.country}</span>}
            <button className="save_button" onClick={handleSave}>
              Save
            </button>
            <button
              className="cancel_button"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            {user.addresses && user.addresses.length > 0 ? (
              user.addresses.map((address) => (
                <div key={address.id} className="address_item">
                  <p>{address.name}</p>
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p>{address.country}</p>
                  <button
                    className="edit_button"
                    onClick={() => handleEdit(address)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete_button"
                    onClick={() => handleDelete(address.id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No addresses saved.</p>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Addresses;
