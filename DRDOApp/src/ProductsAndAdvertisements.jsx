import React, { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
// const labId = "68281329c79492a7cf984910"; // Replace with the actual lab ID
const ProductsAndAdvertisements = ({ labId }) => {
  const [products, setProducts] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${apiUrl}/api/labs/${labId}/products-advertisements`
        );
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        products.map((item, index) => (
          <div key={index} style={cardStyle}>
            <h4>{item.name}</h4>
            <p>{item.description}</p>
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

      <h2 style={{ marginTop: "2rem" }}>Advertisements</h2>
      {advertisements.length === 0 ? (
        <p>No advertisements available.</p>
      ) : (
        advertisements.map((item, index) => (
          <div key={index} style={cardStyle}>
            <h4>{item.name}</h4>
            <p>{item.description}</p>
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
  padding: "1rem",
  marginBottom: "1rem",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const linkStyle = {
  color: "#007BFF", // Bootstrap blue
  textDecoration: "underline",
  fontWeight: "bold",
};

export default ProductsAndAdvertisements;
