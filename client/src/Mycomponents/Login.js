import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('https://your-workspace.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });


      const data = await res.json();

      if (res.status === 200 && data.success) {
        const user = data.user;
        navigate('/main', {
          state: {
            userId: user.id,
            username: user.username,
            email: user.email,
            avatar: user.profile_image || '/default-avatar.png',
          },
        });
      } else if (res.status === 404) {
        setMessage('Username or email not found. Please register first.');
      } else if (res.status === 401) {
        setMessage('Incorrect password. Please try again.');
      } else {
        setMessage(data.error || 'Login failed. Try again later.');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url('/bg.jpeg')`,
        backgroundSize: 'cover',
        minHeight: '100vh',
      }}
    >
      <div className="login-box">
        <div className="login-image">
          <img src="/intro1.jpg" alt="cartoon" />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h3>Good to See You Again!</h3>

          <label className="form-label">Email or Username</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your email or username"
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

          <button type="submit" className="btn">Login</button>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
