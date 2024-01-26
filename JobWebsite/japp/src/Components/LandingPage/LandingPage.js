// src/components/LandingPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateUserForm from '../CreateUser/CreateUser';
import './LandingPage.css'
import { postData } from '../../RestAPIs/Apis';

const LandingPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    // Navigate to the dashboard with the username as a URL parameter
  //   fetch("http://localhost:8000/login", {username:username,password:password}).then((response) => {
  //     if (!response.ok) {
  //       throw new Error('Login failed');
  //     }
  //     return response.json();
  //   })
  //   .then((data) => {
  //     // Handle successful login
  //     console.log(data)
  //   })
  //   .catch((error) => {
  //     console.error('Login error:', error);
  //     // Handle 
  //   // navigate('/dashboard', { state: { username:username } });
  // });
  fetch("http://localhost:8000/user", {username:username})
}

    return (
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              placeholder="Enter your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  };

export default LandingPage;
