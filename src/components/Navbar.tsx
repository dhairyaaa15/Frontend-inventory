import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch username from API
  const fetchUsername = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login'); // Redirect if no token
      return;
    }

    try {
      const response = await fetch('https://backend-inventory-4xuz.onrender.com/api/customers/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch username');
      }

      const data = await response.json();
      setUsername(data.name);
    } catch (error) {
      console.error('Error fetching username:', error);
      setError('Could not fetch username. Please try again later.');
      setUsername(''); // Reset username on error
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear token
    navigate('/login'); // Redirect to login page
  };

  // Navigation functions for Items and Maintenance
  const handleItemsClick = () => {
    navigate('/main'); // Redirect to Main.tsx
  };

  const handleMaintenanceClick = () => {
    navigate('/maintenance'); // Redirect to Maintenance.tsx
  };

  return (
    <div className="w-3/5 mx-auto">
      <nav className="bg-gradient-to-r from-blue-100 to-blue-300 p-4 flex justify-between items-center rounded-3xl">
        <div className="text-2xl font-bold text-gray-800">
          {error ? (
            <span className="text-red-300">{error}</span>
          ) : (
            `Welcome to the inventory, ${username || 'Guest'}`
          )}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleItemsClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Items
          </button>
          <button
            onClick={handleMaintenanceClick}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Maintenance
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;