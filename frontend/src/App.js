import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";

import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [authPage, setAuthPage] = useState("login");
  const [page, setPage] = useState("products");

  if (!loggedIn) {
    return authPage === "login" ? (
      <Login
        setLoggedIn={setLoggedIn}
        goToRegister={() => setAuthPage("register")}
      />
    ) : (
      <Register switchToLogin={() => setAuthPage("login")} />
    );
  }

  return (
    <div>
      <Navbar setPage={setPage} />

      {page === "products" && <Products />}
      {page === "cart" && <Cart />}
    </div>
  );
}

export default App;