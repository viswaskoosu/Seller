import React , {useState} from 'react'

const AddressTemplate = ({address, setAddress, handleKeyDown}) => {
    const [errors, setErrors] = useState({});
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
        if (!address.name) validationErrors.name = "Name is required";
        if (!address.street) validationErrors.street = "Street is required";
        if (!address.city) validationErrors.city = "City is required";
        if (!address.state) validationErrors.state = "State is required";
        if (!address.zip.match(/^\d{6}$/))
          validationErrors.zip = "Invalid PIN code";
        if (!address.country && !manualCountry)
          validationErrors.country = "Country is required";
        return validationErrors;
      };
      const handleSave = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      }
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
            setErrors((prevErrors) => ({ ...prevErrors, zip: "Invalid PIN code" }));
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
        setErrors((prevErrors) => ({ ...prevErrors, country: "" }));
      };
    
  return (
    <div className="address_form">
            <input
              type="text"
              placeholder="Name"
              value={address.name}
              onChange={(e) =>
                setAddress({ ...address, name: e.target.value })
              }
            />
            {errors.name && <span className="error">{errors.name}</span>}
            <input
              type="text"
              placeholder="Street"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
            />
            {errors.street && <span className="error">{errors.street}</span>}
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) =>
                setAddress({ ...address, city: e.target.value })
              }
            />
            {errors.city && <span className="error">{errors.city}</span>}
            <input
              type="text"
              placeholder="State"
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
            />
            {errors.state && <span className="error">{errors.state}</span>}
            <input
              type="text"
              placeholder="PIN Code"
              value={address.zip}
              onChange={handlePinChange}
            />
            {errors.zip && <span className="error">{errors.zip}</span>}
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
                onChange={(e) =>
                  setAddress({ ...address, country: e.target.value })
                }
              />
            )}
            {errors.country && <span className="error">{errors.country}</span>}
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
  )
}

export default AddressTemplate