// import React from "react";
// import "./ProductDetailInfo.css"; // Import your CSS file
// import { useParams } from "react-router-dom";

// function ProductDetailInfo() {
//   const { id } = useParams();
  
//   const product = products.find((product) => product.id === id); 

//   if (!product) {
//     return <h2>Product not found</h2>;
//   }

//   return (
//     <div className="product_description">
//       <div className="productDetail">
//         <div className="imagePreviews">
//           {product.images.map((img, index) => (
//             <img
//               key={index}
//               src={img}
//               alt={`Preview ${index}`}
//               className={`imagePreview`}
//             />
//           ))}
//         </div>
//         <div className="productDetail_imageContainer">
//           <img
//             src={product.images[0]} // Assuming first image as default
//             alt={product.title}
//             className="productDetail_image"
//           />
//         </div>
//         <div className="productDetail_info">
//           <p className="productDetail_title">{product.title}</p>
//           <p className="product_category">Category: {product.category}</p>
//           <p className="productDetail_price">
//             <strong>Price: </strong>
//             <small>₹</small>
//             <strong>{product.mrp}</strong>{" "}
//             <strong
//               style={{
//                 textDecoration: "line-through",
//                 color: "grey",
//                 fontWeight: "normal",
//                 marginLeft: "10px",
//                 fontSize: "18px",
//               }}
//             >
//               {product.price}
//             </strong>
//           </p>

//           <div className="specifications">
//             <p className="specifications_title">Specifications:</p>
//             <ul>
//               {Object.keys(product.specifications).map((key, index) => (
//                 <li key={index}>
//                   <strong>{key}:</strong> {product.specifications[key]}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="keyFeatures">
//             <p className="keyFeatures_title">Key Features:</p>
//             <ul>
//               {product.keyFeatures.map((feature, index) => (
//                 <li key={index}>{feature}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Example product image */}
//       <img className="product-image" src="product.jpg" alt="Product" />
//     </div>
//   );
// }

// export default ProductDetailInfo;
