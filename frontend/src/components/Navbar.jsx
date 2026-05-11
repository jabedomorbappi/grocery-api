import API from "../api/api";

function Navbar({ setPage }) {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">

      <a className="navbar-brand" href="#">
        Grocery App 🛒
      </a>

      <div className="ms-auto">

        <button
          className="btn btn-outline-light me-2"
          onClick={() => setPage("products")}
        >
          Products
        </button>

        <button
          className="btn btn-outline-light me-2"
          onClick={() => setPage("cart")}
        >
          Cart
        </button>

        <button
          className="btn btn-danger"
          onClick={logout}
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;