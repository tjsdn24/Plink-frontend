import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';

const Button = styled.button`
  width: 100%;
  padding: 20px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${({ isActive }) => (isActive ? c('brand.pink') : c('neutral.gray'))};
  color: ${({ isActive }) => (isActive ? c('neutral.white') : 'rgba(44, 50, 73, 0.50)')};
  ${typography('label01')};
  text-align: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease, color 0.2s ease;
  box-sizing: border-box;

  &:hover {
    background: ${({ isActive }) => (isActive ? c('brand.darkPink') : c('neutral.gray'))};
  }

  &:active {
    background: ${({ isActive }) => (isActive ? c('brand.darkPink') : c('neutral.gray'))};
  }
`;

export default function LoginButton({ children = '입장하기', disabled = false, isActive = false, onClick, ...props }) {
  return (
    <Button disabled={disabled} isActive={isActive} onClick={onClick} {...props}>
      {children}
    </Button>
  );
}
