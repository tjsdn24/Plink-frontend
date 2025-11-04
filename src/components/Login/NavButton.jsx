import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';

const ButtonWrapper = styled.div`
  position: ${({ $isRelative }) => ($isRelative ? 'relative' : 'fixed')};
  bottom: ${({ $isRelative }) => ($isRelative ? 'auto' : '52px')};
  left: 0;
  right: 0;
  padding: ${({ $isRelative }) => ($isRelative ? '0' : '0 16px')};
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 20px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: ${({ $outline }) => ($outline ? `1px solid ${c('neutral.white')}` : 'none')};
  background: ${({ isActive, $outline }) => {
    if ($outline) return 'transparent';
    return isActive ? c('brand.pink') : c('neutral.gray');
  }};
  color: ${({ $outline, isActive }) => {
    if ($outline) return c('neutral.white');
    return isActive ? c('neutral.white') : 'rgba(44, 50, 73, 0.50)';
  }};
  ${typography('label01')};
  text-align: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: ${({ isActive, $outline }) => {
      if ($outline) return 'rgba(255, 255, 255, 0.1)';
      return isActive ? c('brand.darkPink') : c('neutral.gray');
    }};
  }

  &:active {
    background: ${({ isActive, $outline }) => {
      if ($outline) return 'rgba(255, 255, 255, 0.2)';
      return isActive ? c('brand.darkPink') : c('neutral.gray');
    }};
  }
`;

export default function NavButton({ children = '가입하기', disabled = false, isActive = false, onClick, $outline = false, $isRelative = false, ...props }) {
  return (
    <ButtonWrapper $isRelative={$isRelative}>
      <Button disabled={disabled} isActive={isActive} onClick={onClick} $outline={$outline} {...props}>
        {children}
      </Button>
    </ButtonWrapper>
  );
}
