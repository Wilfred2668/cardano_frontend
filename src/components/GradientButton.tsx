import type { ReactNode } from 'react';

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

const GradientButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = '',
  type = 'button'
}: GradientButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-8 py-4 font-semibold text-black bg-white rounded-lg
        hover:bg-gray-100 active:scale-95
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default GradientButton;
