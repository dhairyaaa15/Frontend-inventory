// src/pages/Home.tsx
import React from 'react';
import LoginSignup from '../components/LoginSignup';
import WelcomeMessage from '../components/WelcomeMessage';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center h-screen p-4 bg-gradient-to-r from-blue-100 via-blue-200 to-purple-200">
      <div className="w-full md:w-1/3 flex items-center justify-center mb-8 md:mb-0">
        <LoginSignup />
      </div>
      <div className="w-full md:w-2/3 flex items-center justify-center">
        <WelcomeMessage />
      </div>
    </div>
  );
};

export default Home;