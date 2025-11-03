import TitleBar from './TitleBar';
import eventIcon from '../../assets/icons/HomeEvent.svg';
import styled from 'styled-components';
import { c, f, s } from '../../styles/themeUtils';
import { BoxContainer } from './BoxContainer';
export default function EventBox() {
  return (
    <BoxContainer>
      <TitleBar
        imageurl={eventIcon}
        title="이벤트"
        description="현장에서만 즐길 수 있는 이벤트에 참여하세요!"
      />
    </BoxContainer>
  );
}
