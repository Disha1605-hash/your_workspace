import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status === 201 && data.success) {
        navigate('/quote', { state: { userId: data.user_id, ...form } });
      } else if (res.status === 409) {
        setMessage('User already exists. Please login instead.');
      } else {
        setMessage(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div
      className="register-container"
      style={{
        backgroundImage: `url('/bg.jpeg')`,
        backgroundSize: 'cover',
        minHeight: '100vh',
      }}
    >
      <div className="register-box">
        <div className="register-image">
          <img src="/intro.jpg" alt="cartoon" />
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          <h3>Create Your Account</h3>

          <label className="form-label">Username</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />

          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <button type="submit" className="btn">Register</button>
          {message && <p className="message">{message}</p>}

          <p className="redirect-msg">
            Already a member?{' '}
            <span className="redirect-link" onClick={goToLogin}>
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
