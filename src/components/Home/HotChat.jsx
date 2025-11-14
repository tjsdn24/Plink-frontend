import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';
import { BoxContainer } from './BoxContainer';
import defaultProfile from '../../assets/icons/profile/avatar1.svg';
import dots from '../../assets/icons/HomeThree.svg';
export default function HotChat({
  id,
  postList = [],
  image = defaultProfile,
  nickname = '행복한 눈멍이',
  time = '4분 전',
  content = '닭갈비 맛있어요',
  images = [],
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    const targetPost = postList.find(p => p.id === id);

    navigate(`/chat/post/${id}`, {
      state: { post: targetPost },
    });
  };

  return (
    <Container>
      <Wrapper>
        <Profile>
          <img src={image} alt="프로필 이미지" width="40px" />
          <ProfileWrapper>
            <Nickname>{nickname}</Nickname>
            <Time>{time}</Time>
          </ProfileWrapper>
        </Profile>
      </Wrapper>

      <Content onClick={handleClick} style={{ cursor: 'pointer' }}>
        {content}
        {/* images[0] 있을 때만 미리보기 이미지 렌더링 */}

        {images.length > 0 && <PreviewImage src={images[0].imageUrl} alt="미리보기 이미지" />}
      </Content>
    </Container>
  );
}
const PreviewImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-top: 12px;
  cursor: pointer;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
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
