import { useEffect, useState } from "react";
import API from "../api/api";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("orders/");

      console.log("ORDERS RESPONSE:", res.data);

      const data = res.data.orders || res.data;

      setOrders(Array.isArray(data) ? data : []);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">My Orders 📦</h2>

      {orders.length === 0 ? (
        <p className="text-center text-muted">
          No orders found
        </p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card mb-3 shadow-sm">

            <div className="card-body">

              {/* ORDER HEADER */}
              <div className="d-flex justify-content-between">

                <h5>Order #{order.id}</h5>

                <span
                  className={
                    order.status === "delivered"
                      ? "badge bg-success"
                      : order.status === "shipped"
                      ? "badge bg-primary"
                      : "badge bg-warning"
                  }
                >
                  {order.status || "pending"}
                </span>

              </div>

              <hr />

              {/* ITEMS */}
              {order.items?.map((item, i) => (
                <div key={i} className="d-flex justify-content-between">
                  <span>
                    {item.product} × {item.quantity}
                  </span>
                  <span>${item.price}</span>
                </div>
              ))}

              <hr />

              {/* FOOTER */}
              <div className="d-flex justify-content-between">

                <h6>Total: ${order.total_price}</h6>

                <span
                  className={
                    order.payment_status
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {order.payment_status ? "Paid" : "Pending Payment"}
                </span>

              </div>

            </div>
          </div>
        ))
      )}

    </div>
  );
}

export default Orders;