import Login from "./Login";
import Products from "./Products";
import Cart from "./Cart";
import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <div>
      {loggedIn ? (
  <>
    <Products />
    <Cart />
  </>
) : (
  <Login setLoggedIn={setLoggedIn} />
)}
    </div>
  );
}

export default App;