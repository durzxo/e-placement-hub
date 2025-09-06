import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/register', formData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      alert(`Registration failed: ${error.response.data.message}`);
    }
  };

  return (
    // Your existing form JSX is fine. This is the logic you need.
    <div>
      <h2>Register a New Account</h2>
      <form onSubmit={handleSubmit}>
        <div><label>Name:</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
        <div><label>Email:</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
        <div><label>Password:</label><input type="password" name="password" value={formData.password} onChange={handleChange} required /></div>
        <div><label>Role:</label><select name="role" value={formData.role} onChange={handleChange}><option value="student">Student</option><option value="company">Company</option><option value="admin">Admin</option></select></div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;