import styled from 'styled-components';

const Bar = styled.header`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  font-family: ${({ theme }) => theme.font.main};
  padding: 14px 16px;
  text-align: center;
`;

export default function Header() {
  return <Bar>Plink</Bar>;
}
