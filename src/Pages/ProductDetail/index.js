// src/Pages/ProductDetail.js

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useStateValue } from "../../Context/StateProvider";
import { actionTypes } from "../../reducer";
import "./ProductDetail.css"; // Import CSS file
import Carousel from "../../components/Carousel"; // Import Carousel component
import ProductDetailInfo from "../ProductDetailInfo";
import TagsInput, { ImageTagsInput } from "../../components/TagsInput";
import { postReq, displayError } from "../../Requests";
import FileUpload from "../../components/FileUpload";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingPage from "../LoadingPage";
const ProductDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { productId } = useParams();
  const [{ products }, dispatch] = useStateValue();
  const product = products.find((prod) => prod.id === productId);
  // console.log(product)
  if (!product) {
    if (isLoading === false) setIsLoading(true);
  } else {
    if (isLoading === true) setIsLoading(false);
  }
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [tags, setTags] = useState(product ? product.tags : []);
  const [keyFeatures, setKeyFeatures] = useState(
    product ? product.keyFeatures : []
  );
  const [images, setImages] = useState(product ? product.images : []);
  // const [imageNames, setImageNames] = useState(
  //   product
  //     ? product.images.map((url) => {
  //         const pathname = new URL(url).pathname;
  //         return pathname.substring(pathname.lastIndexOf("/") + 1);
  //       })
  //     : []
  // );
  const [imageFiles, setImageFiles] = useState(
    product
      ? product.images.map((url) => {
          const pathname = new URL(url).pathname;
          return { name: pathname.substring(pathname.lastIndexOf("/") + 1) };
        })
      :
       []
  );
  // const [t, st] = useState([])
  // console.log(imageFiles)
  useEffect(() => {
    if (product && images.length===0){
      setImages(product.images)
    }
    if  (product && imageFiles.length===0){
      setImageFiles(product?.images.map((url) => {
        const pathname = new URL(url).pathname;
        return { name: pathname.substring(pathname.lastIndexOf("/") + 1) };
      }))
    }
  }, [products])
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);
  };
  useEffect(() => {
    if (product) {
      // Convert specifications object to an array of key-value pairs
      const specificationsArray = Object.entries(product.specifications).map(
        ([key, value]) => ({
          key,
          value,
        })
      );
      setUpdatedProduct({ ...product, specifications: specificationsArray });
    }
  }, [product]);

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecificationChange = (index, key, value) => {
    const newSpecifications = [...updatedProduct.specifications];
    newSpecifications[index] = { key, value };
    setUpdatedProduct((prev) => ({
      ...prev,
      specifications: newSpecifications,
    }));
  };

  const handleAddSpecification = () => {
    setUpdatedProduct((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const handleDeleteSpecification = (index) => {
    const newSpecifications = updatedProduct.specifications.filter(
      (_, i) => i !== index
    );
    setUpdatedProduct((prev) => ({
      ...prev,
      specifications: newSpecifications,
    }));
  };

  const handleSave = () => {
    // Convert specifications array back to an object
    const specificationsObject = updatedProduct.specifications.reduce(
      (acc, { key, value }) => {
        acc[key] = value;
        return acc;
      },
      {}
    );
    const formData = new FormData();
    imageFiles.forEach((file) => {
      if (
        file instanceof File
        // file.hasOwnProperty("name") &&
        // file.hasOwnProperty("size") &&
        // file.hasOwnProperty("type")
      ) {
        formData.append("image", file);
      }
    });
    formData.append("productId", productId)
    // const filteredImages =
    const modifiedProduct = {
      ...updatedProduct,
      specifications: specificationsObject,
    };
    postReq(
      setIsLoading,
      `/product/uploadimages?id=${productId}`,
      formData,
      "multipart/form-data"
    )
      .then((responseData) => {
        // console.log("Files uploaded successfully:", response.data);
        const oldImageURLs = images;
        const imageURLs = oldImageURLs.filter(url => imageFiles.some(file => {
          const pathname = new URL(url).pathname;
          return (file.name===pathname.substring(pathname.lastIndexOf("/") + 1) );
          }))
        console.log(responseData)
        responseData.forEach((path) => {
          imageURLs.push(`${process.env.REACT_APP_API_URL}${path}`);
        });
        modifiedProduct.images = imageURLs;
        setImages(imageURLs)
        // console.log(modifiedProduct)
        postReq(
          setIsLoading,
          "/product/editproduct?request=UPDATE",
          modifiedProduct
        )
          .then(() => {
            dispatch({
              type: actionTypes.UPDATE_PRODUCT,
              product: modifiedProduct,
            });
          })
          .catch((e) => {
            displayError(e);
          });
        setIsEditing(false);
      })
      .catch((error) => {
        toast.error("Error uploading files: " + error);
      })
      .finally(() => {
        console.log("hi");
      });
  };

  const handleCancel = () => {
    // Convert specifications object to an array of key-value pairs
    const specificationsArray = Object.entries(product.specifications).map(
      ([key, value]) => ({
        key,
        value,
      })
    );
    setUpdatedProduct({ ...product, specifications: specificationsArray });
    setIsEditing(false);
  };
  return isLoading ? (
    <LoadingPage />
  ) : (
    !products? <>Error in contacting server</>:
    <div className="product-detail">
      <div className="product-detail-header">
        <h2>Product Detail</h2>
        {!isEditing && (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="edit-form">
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={updatedProduct.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={updatedProduct.price}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>MRP:</label>
            <input
              type="number"
              name="mrp"
              value={updatedProduct.mrp}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={updatedProduct.category}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={updatedProduct.description}
              onChange={handleInputChange}
              className="resize-textarea"
              rows={Math.max(updatedProduct.description.split("\n").length, 1)}
              style={{ resize: "vertical" }}
            />
          </div>
          <div className="form-group">
            <label>Available:</label>
            <input
              type="number"
              name="available"
              value={updatedProduct.available}
              onChange={handleInputChange}
            />
          </div>
          {/* <div className='form-group'>
            <label>Tags:</label>
            <textarea
              name="tags"
              value={updatedProduct.tags.join('\n')}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: 'tags',
                    value: e.target.value.split('\n'),
                  },
                })
              }
              rows={Math.max(updatedProduct.tags.length, 1)}
              style={{ resize: 'vertical' }}
              className='resize-textarea'
            />
          </div> */}
          <TagsInput
            newTag={tags}
            setNewTag={setTags}
            handleInputChange={handleInputChange}
            name="tags"
            displayName="Tags"
          />
          <TagsInput
            newTag={keyFeatures}
            setNewTag={setKeyFeatures}
            handleInputChange={handleInputChange}
            name="keyFeatures"
            displayName="Key Features"
          />
          {/* <div className='form-group'>
            <label>Key Features:</label>
            <textarea
              name="keyFeatures"
              value={updatedProduct.keyFeatures.join('\n')}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: 'keyFeatures',
                    value: e.target.value.split('\n'),
                  },
                })
              }
              rows={Math.max(updatedProduct.keyFeatures.length, 1)}
              style={{ resize: 'vertical' }}
              className='resize-textarea'
            />
          </div> */}
          <div className="form-group">
            <label>Specifications:</label>
            <div className="specifications">
              {updatedProduct.specifications.map((spec, index) => (
                <div key={index} className="specification">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) =>
                      handleSpecificationChange(
                        index,
                        e.target.value,
                        spec.value
                      )
                    }
                    className="spec-input"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) =>
                      handleSpecificationChange(index, spec.key, e.target.value)
                    }
                    className="spec-input"
                  />
                  <button onClick={() => handleDeleteSpecification(index)}>
                    Delete
                  </button>
                </div>
              ))}
              <button onClick={handleAddSpecification}>
                Add Specification
              </button>
            </div>
          </div>
          {/* <div className='form-group'>
            <label>Images:</label>
            <textarea
              name="images"
              value={updatedProduct.images.join('\n')}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: 'images',
                    value: e.target.value.split('\n'),
                  },
                })
              }
              rows={Math.max(updatedProduct.images.length, 1)}
              style={{ resize: 'vertical' }}
              className='resize-textarea'
            />
          </div> */}
          {/* <TagsInput
            newTag={imageNames}
            setNewTag={setImageNames}
            handleInputChange={handleInputChange}
            name="images"
            displayName="Images"
          /> */}
          <ImageTagsInput
            newTag={imageFiles? imageFiles: []}
            setNewTag={setImageFiles}
            displayName="images"
          />
          <div>
            <FileUpload handleFileUpload={handleFileUpload} />
          </div>
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      ) : (
        <Link to={`/product-preview/${product.id}`}>View Product Details</Link>
      )}
    </div>
  );
};

export default ProductDetail;
