import React from 'react';
import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';

export default function CaptureButton({ onClick, children }) {
  return <Button onClick={onClick} />;
}

const Button = styled.button`
  border-radius: 99px;
  margin-top: 10%;
  width: 80px;
  height: 80px;
  border: 4px solid ${c('brand.pink')};
  background: ${c('neutral.white')};
  color: ${c('neutral.white')};
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.98);
  }
`;
