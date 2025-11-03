import TitleBar from './TitleBar';
import talkIcon from '../../assets/icons/HomeTalk.svg';
import styled from 'styled-components';
import { c, f, s } from '../../styles/themeUtils';
import { BoxContainer } from './BoxContainer';
export default function ChatBox() {
  return (
    <BoxContainer>
      <TitleBar
        imageurl={talkIcon}
        title="이야기"
        description="관심있는 주제로 이야기를 나눠보세요!"
      />
    </BoxContainer>
  );
}
