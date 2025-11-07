import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SadEmoji from '../../assets/icons/SadEmoji.svg';
import { c, s, typography } from '../../styles/themeUtils';

export default function NonSearch({ onWrite }) {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Emoji src={SadEmoji} alt="검색 결과 없음" />
      <Title>아직 이 이야기는 조용하네요</Title>
      <Description>
        찾으시는 키워드로 지금<br />첫번째 이야기를 시작해보세요!
      </Description>
      <ActionButton
        type="button"
        onClick={() => {
          if (typeof onWrite === 'function') {
            onWrite();
          } else {
            navigate('/chat');
          }
        }}
      >
        이야기하기
      </ActionButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 65px;
  gap: ${s('md')};
  padding: ${s('xl')} ${s('md')};
  text-align: center;
  color: ${c('neutral.black')};
`;

const Emoji = styled.img`
  width: 64px;
  height: 64px;
`;

const Title = styled.h2`
  margin: 0;
  ${typography('display02')};
`;

const Description = styled.p`
  margin: 0;
  ${typography('body01')};
  color: ${c('neutral.black')};
  white-space: pre-line;
`;

const ActionButton = styled.button`
  margin-top: ${s('md')};
  padding: ${s('md')} ${s('xl')};
  width: calc(100% - 32px);
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${c('brand.pink')};
  color: ${c('neutral.white')};
  ${typography('label01')};
  cursor: pointer;

  &:hover {
    background: ${c('brand.darkPink')};
  }
`;

