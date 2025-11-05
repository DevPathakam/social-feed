// src/pages/Login.tsx
import Brand from "components/Brand";
import { useAuth } from "context/Auth/useAuth";
import React, { useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("testuser@logicwind.com");
  const [password, setPassword] = useState("Test123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const ok = await auth.login(email, password);
    setLoading(false);
    if (ok) {
      navigate("/feed");
    } else {
      setError("Invalid credentials. Please Try again.");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="centered-div">
        <Brand />
        <div
          className="card p-4 border border-3 border-dark rounded-5"
          style={{ minWidth: 360 }}
        >
          <h4 className="mb-3">Sign in</h4>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <fieldset className="mb-2">
                <label htmlFor="login_email" className="mb-1 fw-semibold">
                  Email
                </label>
                <FormControl
                  id="login_email"
                  type="email"
                  value={email}
                  className="shadow border border-3 border-dark"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="testuser@logicwind.com"
                />
              </fieldset>

              <fieldset className="mb-2">
                <label htmlFor="login_password" className="mb-1 fw-semibold">
                  Password
                </label>
                <FormControl
                  id="login_password"
                  type="password"
                  value={password}
                  className="shadow border border-3 border-dark"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Test123!"
                />
              </fieldset>
            </div>

            <div className="d-grid">
              <Button
                className="shadow border border-3 border-dark"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
