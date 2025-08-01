import React from 'react';
import { motion } from 'framer-motion';

const STYLES = {
  button: {
    default: 'linear-gradient(180deg, #FF8A65 0%, #FF7043 100%)',
    hover: 'linear-gradient(180deg, #FF9E80 0%, #FF8A65 100%)'
  }
};

const ANIMATIONS = {
  button: {
    hover: { scale: 1.01, y: -2 },
    tap: { scale: 0.98, y: 1 }
  }
};

interface SubmitButtonProps {
  isLoading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading }) => (
  <motion.button
    whileHover={ANIMATIONS.button.hover}
    whileTap={ANIMATIONS.button.tap}
    type="submit"
    disabled={isLoading}
    className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-medium rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
    style={{
      background: STYLES.button.default,
      borderRadius: '8px',
      fontWeight: 500
    }}
  >
    {isLoading ? (
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
        <span style={{ fontWeight: 500 }}>Initializing...</span>
      </div>
    ) : (
      <span style={{ fontWeight: 500 }}>Access Command Center</span>
    )}
  </motion.button>
);

export default SubmitButton;
