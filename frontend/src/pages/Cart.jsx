import { useEffect, useState } from "react";
import API from "../api/api";

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

      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  const checkout = async () => {
  try {
    const res = await API.post("checkout/");

    alert(
      `Order placed successfully ✔ Order ID: ${res.data.order_id}`
    );

    fetchCart(); // refresh cart (it will be empty)
  } catch (err) {
    console.log(err);
    alert("Checkout failed ❌");
  }
};

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">My Cart 🛒</h2>

      <div className="row">

        {/* LEFT: CART ITEMS */}
        <div className="col-md-8">

          {cart.map((item) => (
            <div
              key={item.id}
              className="card mb-3 shadow-sm"
            >
              <div className="card-body d-flex justify-content-between align-items-center">

                {/* PRODUCT INFO */}
                <div>
                  <h5>{item.product}</h5>
                  <p className="mb-1 text-muted">
                    Price: ${item.price}
                  </p>
                  <p className="mb-0">
                    Total: <b>${item.total}</b>
                  </p>
                </div>

                {/* QUANTITY CONTROLS */}
                <div className="d-flex align-items-center">

                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      updateCart(item.id, item.quantity - 1)
                    }
                  >
                    -
                  </button>

                  <span className="mx-3">
                    {item.quantity}
                  </span>

                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      updateCart(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>

                </div>

                {/* REMOVE */}
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => updateCart(item.id, 0)}
                >
                  Remove
                </button>

              </div>
            </div>
          ))}

        </div>

        {/* RIGHT: SUMMARY */}
        <div className="col-md-4">

          <div className="card shadow-sm p-3">

            <h4>Order Summary</h4>

            <hr />

            <h5>Total:</h5>
            <h3 className="text-success">
              ${total}
            </h3>

            <button
  className="btn btn-success w-100 mt-3"
  onClick={checkout}
>
  Checkout
</button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Cart;