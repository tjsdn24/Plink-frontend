import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';

const ButtonWrapper = styled.div`
  position: fixed;
  bottom: ${({ $keyboardHeight }) => ($keyboardHeight > 0 ? `${$keyboardHeight + 52}px` : '52px')};
  left: 0;
  right: 0;
  padding: 0 16px;
  width: 100%;
  box-sizing: border-box;
  z-index: 1000;
  transition: bottom 0.3s ease;
`;

const Button = styled.button`
  width: 100%;
  padding: 20px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${c('neutral.white')} !important;
  background: ${({ isActive, $outline }) => {
    if ($outline) return 'transparent';
    return isActive ? c('brand.pink') : 'transparent';
  }};
  color: ${({ $outline, isActive }) => {
    if ($outline) return c('neutral.white');
    return isActive ? c('neutral.white') : c('neutral.white');
  }};
  ${typography('label01')};
  text-align: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  box-sizing: border-box;

  &:hover {
    background: ${({ isActive, $outline }) => {
      if ($outline) return 'rgba(255, 255, 255, 0.1)';
      return isActive ? c('brand.darkPink') : 'rgba(255, 255, 255, 0.1)';
    }};
  }

  &:active {
    background: ${({ isActive, $outline }) => {
      if ($outline) return 'rgba(255, 255, 255, 0.2)';
      return isActive ? c('brand.darkPink') : 'rgba(255, 255, 255, 0.2)';
    }};
  }
`;

export default function NavButton({ children = '가입하기', disabled = false, isActive = false, onClick, $outline = false, $keyboardHeight = 0, ...props }) {
  return (
    <ButtonWrapper $keyboardHeight={$keyboardHeight}>
      <Button disabled={disabled} isActive={isActive} onClick={onClick} $outline={$outline} {...props}>
        {children}
      </Button>
    </ButtonWrapper>
  );
}
