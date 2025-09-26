
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-secondary-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
