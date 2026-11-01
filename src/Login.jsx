import { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/signup';
    const payload = isLogin 
      ? { email, password } 
      : { email, password, phone, role: 'user' };

    try {
      const response = await fetch(`https://cinepass-backend-1.onrender.com/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      //collect the jason dada here
      const data = await response.json();

      // 2. Check for errors second
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Operation failed');
      }

      setMessage(data.message);

      if (isLogin && data.token) {
        onLoginSuccess({
          token: data.token,
          role: data.role,
          email: data.email,
          phone: data.phone,
        });
      } else if (!isLogin) {
        setIsLogin(true);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Sign in to access your portal' : 'Enter your details to register as a user'}
        </p>

        {message && <div className="status-message">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="switch-auth-text">
          {isLogin ? "Don't have an account?" : 'Already registered?'}
          <button
            type="button"
            className="switch-btn"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
            }}
          >
            {isLogin ? 'Create one' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;