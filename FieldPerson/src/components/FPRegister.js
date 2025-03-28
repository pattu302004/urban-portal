import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: 'auto',
  boxShadow: theme.shadows[5],
  backgroundColor: '#f5f5f5',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  fontSize: '1.1rem',
}));

const FieldPersonRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    department: '',
    email: '',
    phone: '',
    address: ''
  });
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/field-person/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Registration successful!');
        setFormData({ name: '', password: '', department: '', email: '', phone: '', address: '' });
        // Navigate to login page after successful registration
        navigate('/field-person-login');
      } else {
        alert('Error registering field person.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <Container>
      <StyledPaper elevation={6}>
        <Typography variant="h4" align="center" gutterBottom>
          Field Person Registration
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} required margin="normal" variant="outlined" />
          <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required margin="normal" variant="outlined" />
          <TextField fullWidth label="Department" name="department" value={formData.department} onChange={handleChange} required margin="normal" variant="outlined" />
          <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required margin="normal" variant="outlined" />
          <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} required margin="normal" variant="outlined" />
          <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} required margin="normal" variant="outlined" />
          <StyledButton type="submit" fullWidth variant="contained" color="primary">
            Register
          </StyledButton>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default FieldPersonRegister;