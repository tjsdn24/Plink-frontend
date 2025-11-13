import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';
import { BoxContainer } from './BoxContainer';
import defaultProfile from '../../assets/icons/profile/avatar1.svg';

export default function HotChat({
  image = defaultProfile,
  nickname = '행복한 눈멍이',
  time = '4분 전',
  content = '닭갈비 맛있어요',
}) {
  const navigate = useNavigate();

  return (
    <Container>
      <Profile>
        <img
          src={image || defaultProfile} // ⭐ 여기!
          alt="프로필 이미지"
          onClick={() => navigate('/chat')}
          style={{ cursor: 'pointer' }}
          width="40px"
        />
        <ProfileWrapper>
          <Nickname>{nickname}</Nickname>
          <Time>{time}</Time>
        </ProfileWrapper>
      </Profile>
      <Content>{content}</Content>
    </Container>
  );
}

const Container = styled.div`
  background: ${c('neutral.bg')};
  padding: 16px;
  border-radius: 12px;
  gap: 16px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 4px 8px 0 rgba(0, 0, 0, 0.08);
`;

const Profile = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const ProfileWrapper = styled.div`
  gap: 4px;
  display: flex;
  flex-direction: column;
`;

const Nickname = styled.span`
  ${typography('label01')};
`;

const Time = styled.span`
  ${typography('caption01')};
`;
const Content = styled.div`
  ${typography('body01')};
`;
