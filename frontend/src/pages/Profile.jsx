import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function initials(name) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join('');
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function Profile() {
  const { user, loading, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="app-shell">
        <main className="app-main">
          <p className="loading-line">Loading your profile…</p>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const emailPattern = /^\S+@\S+\.\S+$/;

    if (!trimmedName) {
      setError('Name cannot be empty.');
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setError('Enter a valid email address.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ name: trimmedName, email: trimmedEmail });
      setName(trimmedName);
      setEmail(trimmedEmail);
      setSuccess('Profile updated.');
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      // even if the server-side logout call fails, we still want to
      // clear the local session and send the user back to login
    } finally {
      navigate('/login');
    }
  }

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="app-nav-mark">
          <span className="app-nav-mark-glyph">I</span>
          Inkwell
        </div>
        <div className="app-nav-actions">
          <span className="app-nav-link">Signed in as {user.name}</span>
        </div>
      </nav>

      <main className="app-main">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">{initials(user.name)}</div>
            <div>
              <h2>{user.name}</h2>
              <p className="profile-header-sub">{user.email}</p>
            </div>
          </div>

          {error && <div className="form-error" role="alert" style={{ marginTop: '1.25rem' }}>{error}</div>}
          {success && <div className="form-success" role="status" style={{ marginTop: '1.25rem' }}>{success}</div>}

          {editing ? (
            <form className="profile-fields" onSubmit={handleSave} noValidate>
              <div className="field">
                <label htmlFor="profile-name">Full name</label>
                <input id="profile-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="profile-email">Email</label>
                <input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="profile-actions">
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setName(user.name);
                    setEmail(user.email);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="profile-meta">Member since {formatDate(user.createdAt)}</p>
              <div className="profile-actions">
                <button className="btn btn-ghost" type="button" onClick={() => setEditing(true)}>
                  Edit profile
                </button>
                <button className="btn btn-ghost" type="button" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}