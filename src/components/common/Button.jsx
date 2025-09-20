// src/components/common/Button.jsx
import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  position: relative;
  display: inline-block;
  cursor: pointer;
  overflow: hidden;
  border: none;
  
  background-color: var(--green);
  color: var(--navy);
  padding: 15px 20px;
  font-family: 'Radio Canada', sans-serif;
  font-size: 14px;
  font-weight: 400;
  border-radius: 5px;
  text-transform: uppercase;
  letter-spacing: .025em;

  span {
    position: relative;
    z-index: 2;
    transition: color 0.5s cubic-bezier(.4,0,.2,1);
  }

  /* Lớp phủ màu trắng cho hiệu ứng hover */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--white);
    z-index: 1;

    transform: scaleY(0);
    transform-origin: bottom;

    transition: transform 0.5s cubic-bezier(.4,0,.2,1);
  }

  /* KHI HOVER */
  &:hover {
    span {
      color: var(--navy);
    }

    &::after {
      transform: scaleY(1);
      transform-origin: top;
    }
  }
`;

const Button = ({ children, onClick }) => {
  return (
    <StyledButton onClick={onClick}>
      <span>{children}</span>
    </StyledButton>
  );
};

export default Button;