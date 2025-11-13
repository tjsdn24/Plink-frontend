import TitleBar from './TitleBar';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { c, f, s, typography } from '../../styles/themeUtils';
import { BoxContainer } from './BoxContainer';

import talkIcon from '../../assets/icons/HomeTalk.svg';
import Menu1 from '../../assets/icons/HomeInfoMenu.svg';
import Menu2 from '../../assets/icons/HomePresentMenu.svg';
import Menu3 from '../../assets/icons/HomeHeartMenu.svg';
import Menu4 from '../../assets/icons/HomeFoodMenu.svg';

export default function ChatBox() {
  const navigate = useNavigate();

  const buttons = [
    {
      icon: Menu1,
      label: '정보/공유',
      onClick: () => navigate('/chat', { state: { category: '정보/공유' } }),
    },
    {
      icon: Menu2,
      label: '굿즈/이벤트',
      onClick: () => navigate('/chat', { state: { category: '굿즈/이벤트' } }),
    },
    {
      icon: Menu3,
      label: '만남/동행',
      onClick: () => navigate('/chat', { state: { category: '만남/동행' } }),
    },
    {
      icon: Menu4,
      label: '질문/요청',
      onClick: () => navigate('/chat', { state: { category: '질문/요청' } }),
    },
  ];

  return (
    <BoxContainer>
      <TitleBar
        imageurl={talkIcon}
        title="이야기"
        description="관심있는 주제로 이야기를 나눠보세요!"
        onClick={() => navigate('/chat')}
        showArrow={true}
      />
      <MenuBar>
        {buttons.map((btn, i) => (
          <MenuWrapper key={i}>
            <MenuBtn onClick={btn.onClick}>
              {btn.icon && <img src={btn.icon} alt={btn.label} />}
            </MenuBtn>
            <MenuName>{btn.label}</MenuName>
          </MenuWrapper>
        ))}
      </MenuBar>
    </BoxContainer>
  );
}
const MenuBar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: ${s('lg')};
`;
const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  white-space: nowrap;
`;

const MenuBtn = styled.button`
  background: ${c('neutral.bg')};
  border-radius: 12px;
  width: 57px;
  height: 57px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const MenuName = styled.span`
  ${typography('body02')};
`;
