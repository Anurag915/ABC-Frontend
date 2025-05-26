import React, { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProductsAndAdvertisements = ({ labId }) => {
  const [products, setProducts] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/api/labs/${labId}/products-advertisements`);
        const data = await res.json();

        if (res.ok) {
          setProducts(data.products || []);
          setAdvertisements(data.advertisements || []);
          setError("");
        } else {
          setError(data.message || "Something went wrong");
        }
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [labId]);

  if (loading) return <p style={{ fontSize: "1.2rem" }}>Loading...</p>;
  if (error) return <p style={{ color: "red", fontSize: "1.2rem" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={headingStyle}>Products</h2>
      {products.length === 0 ? (
        <p style={textStyle}>No products available.</p>
      ) : (
        products.map((item, index) => (
          <div key={index} style={cardStyle}>
            <h4 style={titleStyle}>{item.name}</h4>
            <p style={textStyle}>{item.description}</p>
            <a
              href={`${apiUrl}${item.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              View/Download File
            </a>
          </div>
        ))
      )}

      <h2 style={{ ...headingStyle, marginTop: "2rem" }}>Advertisements</h2>
      {advertisements.length === 0 ? (
        <p style={textStyle}>No advertisements available.</p>
      ) : (
        advertisements.map((item, index) => (
          <div key={index} style={cardStyle}>
            <h4 style={titleStyle}>{item.name}</h4>
            <p style={textStyle}>{item.description}</p>
            <a
              href={`${apiUrl}${item.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              View/Download File
            </a>
          </div>
        ))
      )}
    </div>
  );
};

const cardStyle = {
  border: "1px solid #ccc",
  padding: "1.5rem",
  marginBottom: "1.5rem",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  fontSize: "1.1rem",
};

const headingStyle = {
  fontSize: "1.8rem",
  fontWeight: "bold",
  marginBottom: "1rem",
};

const titleStyle = {
  fontSize: "1.4rem",
  fontWeight: "600",
  marginBottom: "0.5rem",
};

const textStyle = {
  fontSize: "1.1rem",
  color: "#333",
};

const linkStyle = {
  color: "#007BFF",
  textDecoration: "underline",
  fontWeight: "bold",
  fontSize: "1.1rem",
};

export default ProductsAndAdvertisements;
