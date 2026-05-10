import { useEffect, useState } from "react";
import API from "./api/api";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("products/");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};


const addToCart = async (productId) => {
  try {
    await API.post("cart/add/", {
      product_id: productId,
      quantity: 1,
    });

    alert("Added to cart ✔");

    // 🔥 refresh cart automatically
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
};

  return (
  <div className="container mt-5">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="fw-bold">Grocery Store</h2>
      <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
    </div>

    <div className="row">
      {products.map((p) => (
        <div key={p.id} className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title fw-bold">{p.name}</h5>
              <p className="card-text text-muted">Fresh quality product</p>
              <h4 className="text-primary">${p.price}</h4>
              <button 
                className="btn btn-success w-100 mt-3" 
                onClick={() => addToCart(p.id)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}

export default Products;