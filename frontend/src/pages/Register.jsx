import { useState } from "react";
import API from "../api/api";

function Register({ switchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      await API.post("register/", {
        username,
        email,
        password,
      });

      alert("Registration successful ✔ Please login");
      switchToLogin(); // go back to login page
    } catch (err) {
      console.log(err);
      alert("Registration failed ❌");
    }
  };

  return (
    <div className="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center">

      <div className="card shadow-lg border-0" style={{ width: "400px", borderRadius: "15px" }}>

        {/* HEADER */}
        <div className="card-header bg-success text-white text-center py-3">
          <h4 className="mb-0">Create Account ✨</h4>
          <small>Register new user</small>
        </div>

        <div className="card-body p-4">

          {/* USERNAME */}
          <div className="mb-3">
            <label>Username</label>
            <input
              className="form-control"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label>Email</label>
            <input
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* BUTTON */}
          <button className="btn btn-success w-100" onClick={register}>
            Register
          </button>

          {/* SWITCH BACK */}
          <p className="text-center mt-3">
            Already have an account?{" "}
            <span
              style={{ cursor: "pointer", color: "blue" }}
              onClick={switchToLogin}
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;