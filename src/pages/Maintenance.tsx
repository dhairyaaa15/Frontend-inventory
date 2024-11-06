import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Maintain from '../components/Maintain';


const Maintenance: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log("Token in localStorage:", token); // Log to see if token exists
    if (!token) {
      console.log("No token found, redirecting to login page.");
      navigate('/'); // Redirect to home page if no token is found
    }
  }, [navigate]);

  return (
    <div className='bg-blue-50'>
      <Navbar />
      <Maintain />
    </div>
  );
};

export default Maintenance;
