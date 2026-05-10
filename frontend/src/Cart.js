import { useEffect, useState } from "react";
import API from "./api/api";

function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("cart/");
      setCart(res.data.cart);
      setTotal(res.data.total_price);
    } catch (err) {
      console.log(err);
    }
  };

  const updateCart = async (cartId, qty) => {
    try {
      await API.put("cart/update/", {
        cart_id: cartId,
        quantity: qty,
      });

      if (qty <= 0) {
        /* This part runs ONLY when the 'Remove' button is clicked */
        setCart((prev) => prev.filter((item) => item.id !== cartId));
      } else {
        /* This part runs for Plus and Minus buttons */
        setCart((prev) =>
          prev.map((item) =>
            item.id === cartId
              ? { ...item, quantity: qty, total: item.price * qty }
              : item
          )
        );
      }
      
      fetchCart(); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 fw-bold text-center">Shopping Cart</h2>
      
      <div className="card shadow border-0">
        <div className="card-body">
          {cart.length === 0 ? (
            <p className="text-center py-5 text-muted">Your cart is empty.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th className="text-start">Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td className="text-start fw-bold">{item.product}</td>
                      <td>${item.price}</td>
                      <td>
                        <div className="d-flex justify-content-center align-items-center">
                          {/* 
                              MINUS BUTTON: 
                              Uses Math.max(1, ...) to ensure it NEVER goes below 1.
                          */}
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => updateCart(item.id, Math.max(1, item.quantity - 1))}
                          > - </button>
                          
                          <span className="fw-bold mx-3">{item.quantity}</span>
                          
                          {/* PLUS BUTTON */}
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => updateCart(item.id, item.quantity + 1)}
                          > + </button>
                        </div>
                      </td>
                      <td className="fw-bold text-success">${item.total}</td>
                      <td>
                        {/* 
                            REMOVE BUTTON: 
                            Sends '0' to trigger the deletion logic in Django.
                        */}
                        <button 
                          className="btn btn-sm btn-danger px-3"
                          onClick={() => {
                            if(window.confirm("Remove item?")) updateCart(item.id, 0)
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="card-footer bg-white py-4">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Grand Total: <span className="text-primary fw-bold">${total}</span></h4>
              <button className="btn btn-primary btn-lg px-5 shadow-sm">Checkout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;