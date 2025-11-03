import TitleBar from './TitleBar';
import talkIcon from '../../assets/icons/HomeTalk.svg';
import styled from 'styled-components';
import { c, f, s } from '../../styles/themeUtils';
import { BoxContainer } from './BoxContainer';
export default function HotBox() {
  return (
    <BoxContainer>
      <TitleBar
        imageurl={talkIcon}
        title="인기있는 이야기"
        description="현재 가장 주목받는 이야기들은?"
      />
    </BoxContainer>
  );
}
