import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
}

const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  label = 'Back', 
  className = '',
  variant = 'default' 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent';
      case 'outline':
        return 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${getVariantStyles()} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {label}
    </motion.button>
  );
};

export default BackButton;