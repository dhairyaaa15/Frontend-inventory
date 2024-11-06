import React from 'react';
import WelcomeImage from '../assets/inventory.jpeg';

const WelcomeMessage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full rounded-lg shadow-xl">
      <img src={WelcomeImage} alt="Welcome" className="max-w-full h-auto" />
    </div>
  );
};

export default WelcomeMessage;