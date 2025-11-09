import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';

const Button = styled.button`
  width: 100%;
  padding: 20px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${c('brand.pink')};
  color: ${c('neutral.white')};
  ${typography('label01')};
  text-align: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease, color 0.2s ease;
  box-sizing: border-box;

  &:hover {
    
  }

  &:active {
    background: ${c('brand.darkPink')};
  }
`;

export default function LoginButton({ children = '입장하기', disabled = false, onClick, ...props }) {
  return (
    <Button disabled={disabled} onClick={onClick} {...props}>
      {children}
    </Button>
  );
}
