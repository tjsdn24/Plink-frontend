import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';

const ButtonWrapper = styled.div`
  position: fixed;
  bottom: 52px;
  left: 0;
  right: 0;
  padding: 0 16px;
  width: 100%;
  box-sizing: border-box;
`;

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

  &:hover {
    background: ${({ isActive }) => (isActive ? c('brand.darkPink') : c('neutral.gray'))};
  }

  &:active {
    background: ${({ isActive }) => (isActive ? c('brand.darkPink') : c('neutral.gray'))};
  }
`;

export default function NavButton({ children = '가입하기', disabled = false, isActive = false, onClick, ...props }) {
  return (
    <ButtonWrapper>
      <Button disabled={disabled} isActive={isActive} onClick={onClick} {...props}>
        {children}
      </Button>
    </ButtonWrapper>
  );
}
