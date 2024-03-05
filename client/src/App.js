import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!navigator.onLine) {
        localStorage.setItem('offlineData', JSON.stringify(formData));
        alert('You are offline. Your data will be submitted when you are online.');
        return;
      }

      const response = await axios.post('/api/signup', formData);
      alert(response.data.message);

      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <div className="App">
       <h1>Schrodinger's Signup</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default App;
