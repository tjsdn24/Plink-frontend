import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const Nav = styled.nav`
  background: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.gray300};
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

const NavItem = styled(Link)`
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.gray900)};
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
`;

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <Nav>
      <NavItem to="/" $active={pathname === '/'}>
        HOME
      </NavItem>
      <NavItem to="/photo" $active={pathname === '/photo'}>
        PHOTO
      </NavItem>
      <NavItem to="/chat" $active={pathname === '/chat'}>
        CHAT
      </NavItem>
      <NavItem to="/game" $active={pathname === '/game'}>
        GAME
      </NavItem>
      <NavItem to="/mypage" $active={pathname === '/mypage'}>
        MY
      </NavItem>
    </Nav>
  );
}
