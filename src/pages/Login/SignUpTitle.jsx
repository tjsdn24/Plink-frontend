import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${s('md')};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MainTitle = styled.h2`
  ${typography('display02')};
  color: ${c('neutral.black')};
  line-height: 1.2;
  margin: 0;
`;

export default function SignUpTitle({ userName = '숨쉬는 고양이' }) {
  return (
    <TitleContainer>
      <TextWrapper>
        <MainTitle>
          {userName}님!<br />
          이제 마지막 단계예요!
        </MainTitle>
      </TextWrapper>
    </TitleContainer>
  );
}
