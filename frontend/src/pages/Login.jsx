import { useState } from "react";
import API from "../api/api";

function Login({ setLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // REGISTER extra fields (optional)
  const [email, setEmail] = useState("");

  // LOGIN
  const login = async () => {
    try {
      const res = await API.post("login/", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.access);
      setLoggedIn(true);

      alert("Login successful ✔");
    } catch (err) {
      console.log(err);
      alert("Login failed ❌");
    }
  };

  // REGISTER
  const register = async () => {
    try {
      await API.post("register/", {
        username,
        password,
        email,
      });

      alert("Registration successful ✔ Now login");
      setIsLogin(true); // switch back to login
    } catch (err) {
      console.log(err);
      alert("Registration failed ❌");
    }
  };

  return (
    <div className="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center">

      <div className="card shadow-lg border-0" style={{ width: "400px", borderRadius: "15px" }}>

        {/* HEADER */}
        <div className="card-header bg-primary text-white text-center py-3">
          <h4 className="mb-0">
            {isLogin ? "Welcome Back 👋" : "Create Account ✨"}
          </h4>
          <small>
            {isLogin ? "Login to continue" : "Register new account"}
          </small>
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

          {/* EMAIL (only register) */}
          {!isLogin && (
            <div className="mb-3">
              <label>Email</label>
              <input
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

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
          {isLogin ? (
            <button className="btn btn-primary w-100" onClick={login}>
              Login
            </button>
          ) : (
            <button className="btn btn-success w-100" onClick={register}>
              Register
            </button>
          )}

          {/* SWITCH LINK */}
          <p className="text-center mt-3 mb-0" style={{ cursor: "pointer" }}>
            {isLogin ? (
              <span onClick={() => setIsLogin(false)}>
                Don’t have an account? <b>Register</b>
              </span>
            ) : (
              <span onClick={() => setIsLogin(true)}>
                Already have an account? <b>Login</b>
              </span>
            )}
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;