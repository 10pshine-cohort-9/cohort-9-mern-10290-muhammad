import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      await login({ email, password });
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="auth-brand-mark">
          <span className="auth-brand-mark-glyph">I</span>
          Inkwell
        </div>
        <div className="auth-brand-quote">
          <h1>Pick up right where you left off.</h1>
          <p>
            Every note, organized and waiting — log back in and get straight to
            it.
          </p>
        </div>
        <div className="auth-brand-foot">Cohort 9 · Notes App By 10Pearls</div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <span className="auth-card-eyebrow">Welcome back</span>
          <h2>Log in</h2>
          <p className="auth-card-sub">
            Enter your details to access your notes.
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="auth-switch">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
