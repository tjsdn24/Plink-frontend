import styled from 'styled-components';
import { c, f, s } from '../styles/themeUtils';

const Bar = styled.header`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  font-family: ${({ theme }) => theme.font.main};
  padding: 16px;
  text-align: center;
  height: 60px;
`;

export default function Header() {
  return <Bar>Plink</Bar>;
}
