import firework from '../../assets/images/HomeFirework.webp';
import locationicon from '../../assets/icons/HomeLocation.svg';
import calendaricon from '../../assets/icons/HomeCalendar.svg';
import usersIcon from '../../assets/icons/HomeUsers.svg';

import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';

const InfoBarContainer = styled.div`
  width: 100%;
  height: 162px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  object-fit: fill;
  padding: 12px 12px 17px 12px;
  border-radius: 12px;
  background-image: url(${firework});
  background-size: cover; /* 꽉 차게 (잘릴 수 있음) */
  background-position: center; /* 중앙 정렬 */
  background-repeat: no-repeat; /* 반복 방지 */
  background-blend-mode: darken; /* 배경 어둡게 섞기 */
  background-color: rgba(0, 0, 0, 0.6); /* 살짝 어둡게 */
`;
const GreetingText = styled.span`
  ${typography('display01')};
  color: ${c('neutral.white')};
`;
const FestivalInfoWrapper = styled.div`
  gap: 8px;
  flex-direction: row;
  display: flex;
  align-items: center;
`;
const FestivalInfoText = styled.span`
  ${typography('body02')};
  color: ${c('neutral.white')};
`;
const FestivalInfoContainer = styled.div`
  gap: 8px;
`;
const BottomWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
`;
const PinkText = styled.span`
  ${typography('pink01')};
  color: ${c('brand.pink')};
`;
const SmallPinkText = styled.span`
  ${typography('pink02')};
  color: ${c('brand.pink')};
`;
export default function InfoBar({
  nickname = '숨쉬는 고양이',
  festivalname = '축제',
  location = '서경대학교',
  date = '2025.11.15',
  usernum = 0,
}) {
  return (
    <InfoBarContainer>
      <GreetingText>
        {nickname}님 <br /> 즐거운 {festivalname}되세요!
      </GreetingText>
      <BottomWrapper>
        <FestivalInfoContainer>
          <FestivalInfoWrapper>
            <img src={locationicon} alt="location" />
            <FestivalInfoText>{date}</FestivalInfoText>
          </FestivalInfoWrapper>
          <FestivalInfoWrapper>
            <img src={calendaricon} alt="date" />
            <FestivalInfoText>{location}</FestivalInfoText>
          </FestivalInfoWrapper>
        </FestivalInfoContainer>
        <UserWrapper>
          <FestivalInfoWrapper>
            <img src={usersIcon} alt="user" />
            <FestivalInfoText>지금 여기</FestivalInfoText>
          </FestivalInfoWrapper>
          <PinkText>
            {usernum}
            <SmallPinkText>명</SmallPinkText>
          </PinkText>
        </UserWrapper>
      </BottomWrapper>
    </InfoBarContainer>
  );
}
