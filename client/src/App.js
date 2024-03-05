import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const offlineData = localStorage.getItem('offlineData');
      if (offlineData) {
        const parsedData = JSON.parse(offlineData);
        handleSubmit({ preventDefault: () => {}, isOfflineData: true }, parsedData);
        localStorage.removeItem('offlineData');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e,data) => {
    e.preventDefault();

    try {
      // Simulate offline mode
      if (!isOnline && !e.isOfflineData) {
        localStorage.setItem('offlineData', JSON.stringify(formData));
        alert('You are offline. Your data will be submitted when you are online.');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/signup', data || formData);
      alert(response.data.message);

      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      if (error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response.data.message);
      }
    }
  };
  return (
    <div>
       <h1>Schrodinger's Signup</h1>
      <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        {errors.name && <span>{errors.name}</span>}
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        {errors.email && <span>{errors.email}</span>}
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        {errors.password && <span>{errors.password}</span>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default App;
