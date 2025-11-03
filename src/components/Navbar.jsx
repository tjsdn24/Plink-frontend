import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { typography, c, s } from '../styles/themeUtils';

import home from '../assets/icons/NavHome.svg';
import photo from '../assets/icons/NavPhoto.svg';
import chat from '../assets/icons/NavChat.svg';
import game from '../assets/icons/NavGame.svg';
import my from '../assets/icons/NavMy.svg';

const Nav = styled.nav`
  background: ${c('neutral.black2')};
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 19px;
`;

const NavItem = styled(Link)`
  ${typography('caption01')};
  color: ${({ $active, theme }) => ($active ? theme.colors.brand.pink : theme.colors.neutral.bg)};
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 40px;
  width: 30px;
`;

const ChatIcon = styled(NavItem)`
  flex-basis: 30px;
  background: ${c('brand.pink')};
  border: 5px solid ${c('neutral.black2')};
  border-radius: 99px;
  padding: 19px;
  transform: translateY(-11px);
  width: 70px;
  height: 70px;
  justify-content: center;

  img {
    width: 32px;
    height: 32px;
  }
`;

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <Nav>
      <NavItem to="/" $active={pathname === '/'}>
        <img src={home} alt="HOME" />
        HOME
      </NavItem>
      <div className="width:6px"></div>
      <NavItem to="/photo" $active={pathname === '/photo'}>
        <img src={photo} alt="PHOTO" />
        PHOTO
      </NavItem>
      <ChatIcon to="/chat" $active={pathname === '/chat'}>
        <img src={chat} alt="CHAT" />
      </ChatIcon>

      <NavItem to="/game" $active={pathname === '/game'}>
        <img src={game} alt="GAME" />
        GAME
      </NavItem>
      <div className="width:6px"></div>

      <NavItem to="/mypage" $active={pathname === '/mypage'}>
        <img src={my} alt="MY" />
        MY
      </NavItem>
    </Nav>
  );
}
