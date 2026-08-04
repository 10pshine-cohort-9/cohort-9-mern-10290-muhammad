import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Fill in every field to create your account.");
      return;
    }

    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await signup({ name, email, password });
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
          <h1>Keep every thought within reach.</h1>
          <p>
            A quiet place to write things down before they slip away — yours
            alone, always at hand.
          </p>
        </div>
        <div className="auth-brand-foot">Cohort 9 · Notes App By 10Pearls</div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <span className="auth-card-eyebrow">Get started</span>
          <h2>Create your account</h2>
          <p className="auth-card-sub">
            Takes less than a minute. No card, no clutter.
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Muhammad Osama"
              />
            </div>

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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
