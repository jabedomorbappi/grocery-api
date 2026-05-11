import { useEffect, useState } from "react";
import API from "../api/api";

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

  const addToCart = async (productId) => {
    try {
      await API.post("cart/add/", {
        product_id: productId,
        quantity: 1,
      });

      alert("Added to cart ✔");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">Products 🛒</h2>

      <div className="row">

        {products.map((p) => (
          <div key={p.id} className="col-md-4 mb-4">

            <div className="card shadow-sm h-100">

              {/* IMAGE PLACEHOLDER */}
              <div
                style={{
                  height: "150px",
                  background: "#f2f2f2",
                }}
                className="d-flex align-items-center justify-content-center"
              >
                <span>Product Image</span>
              </div>

              <div className="card-body text-center">

                <h5 className="card-title">{p.name}</h5>

                <p className="text-muted">
                  Price: <b>${p.price}</b>
                </p>

                <button
                  className="btn btn-primary w-100"
                  onClick={() => addToCart(p.id)}
                >
                  Add to Cart 🛒
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