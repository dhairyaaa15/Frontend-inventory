import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSignup: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || (isLogin && !email) || (!isLogin && (!username || !email))) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setFormError('');

    try {
      const response = await fetch(
        isLogin
          ? 'https://backend-inventory-4xuz.onrender.com/api/customers/login'
          : 'https://backend-inventory-4xuz.onrender.com/api/customers/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            isLogin
              ? { email, password }
              : { name: username, password, email }
          ),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        setFormError(errorData.message || 'An error occurred');
        return;
      }

      const data = await response.json();
      console.log('Success:', data);

      // Store the token and navigate to Main page
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        navigate('/main');
      } else {
        setFormError('Failed to retrieve token.');
      }
    } catch (error) {
      console.error('Network error:', error);
      setFormError('Failed to connect to the server');
    }
  };

  return (
    <div className="flex flex-col items-center p-10 bg-blue-50 rounded-xl shadow-lg w-[370px] border border-gray-200 font-poppins">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <p className="mb-6 text-center text-sm text-gray-600">{isLogin ? 'Log in to continue' : 'Sign up to get started'}</p>
      
      <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4 w-full">
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 hover:shadow-md"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 hover:shadow-md"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 w-full hover:shadow-md"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-500 transition duration-150"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 hover:shadow-lg transition duration-200"
        >
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      {formError && <p className="mt-4 text-red-500 font-medium">{formError}</p>}

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-6 text-sm text-blue-500 hover:text-blue-600 focus:outline-none transition duration-150"
      >
        {isLogin ? 'Don’t have an account? Sign Up' : 'Already have an account? Log In'}
      </button>
    </div>
  );
};

export default LoginSignup;
