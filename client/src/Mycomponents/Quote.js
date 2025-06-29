import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Quotes.css';

function Quote() {
  const [quote, setQuote] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { username, email, password } = location.state || {};

  const registerAndProceed = async (includeQuote = false) => {
    if (!username || !email || !password) {
      setMessage('Missing registration details. Please try again.');
      return;
    }

    try {
      // First try to add quote to an existing user
      let userId;
      const userRes = await fetch('http://localhost:5000/get-user-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const userData = await userRes.json();

      if (userRes.ok && userData.user_id) {
        userId = userData.user_id;
      } else {
        // If user not found, create user here
        const res = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          setMessage(data.error || 'Registration failed. Please try again.');
          return;
        }
        userId = data.user_id;
      }

      if (includeQuote && quote.trim()) {
        const quoteRes = await fetch('http://localhost:5000/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, quote }),
        });

        const quoteData = await quoteRes.json();
        if (!quoteRes.ok || !quoteData.success) {
          setMessage('Failed to submit quote. Proceeding anyway...');
        }
      }

      navigate('/main', {
        state: { userId, username, email },
      });

    } catch (err) {
      console.error(err);
      setMessage('Server error. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerAndProceed(true);
  };

  const handleSkip = () => {
    registerAndProceed(false);
  };

  return (
    <div
      className="quote-container"
      style={{
        backgroundImage: `url('/bg.jpeg')`,
        backgroundSize: 'cover',
        minHeight: '100vh',
      }}
    >
      <div className="quote-box">
        <form className="quote-form" onSubmit={handleSubmit}>
          <h3>Before you step into your space...</h3>
          <p>Want to leave a message for others?</p>
          <textarea
            className="forms-control"
            rows="4"
            placeholder="Share your thoughts..."
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
          />
          <button type="submit" className="btn">Submit</button>
          <button
            type="button"
            className="btn"
            onClick={handleSkip}
            style={{ marginLeft: '10px' }}
          >
            Skip
          </button>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Quote;
