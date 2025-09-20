// src/components/common/Button.jsx
import React from 'react';
import '../../styles/components/_button.scss';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  className = '',
  ...props 
}) => {
  const buttonClasses = [
    'button',
    variant !== 'primary' && `button--${variant}`,
    size !== 'medium' && `button--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="button__text">{children}</span>
    </button>
  );
};

export default Button;