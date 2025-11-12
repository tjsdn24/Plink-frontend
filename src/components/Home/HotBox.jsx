import TitleBar from './TitleBar';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import { c, f, s } from '../../styles/themeUtils';
import { BoxContainer } from './BoxContainer';
import talkIcon from '../../assets/icons/HomeTalk.svg';
import HotChat from '../Home/HotChat';

import axios from 'axios';

export default function HotBox() {
  async function fetchData() {
    try {
      const response = await axios.get('http://15.165.177.229:8080/line4thon/main/popular');
      console.log(response.data); // 서버에서 받은 데이터
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
    }
  }

  fetchData();
  const navigate = useNavigate();

  return (
    <BoxContainer>
      <TitleBar
        imageurl={talkIcon}
        title="인기있는 이야기"
        description="현재 가장 주목받는 이야기들은?"
        onClick={() => navigate('/chat')}
      />
      <HotChat nickname="행복한 눈멍이" content="ggg" />
      <HotChat nickname="행복한 눈멍이" content="ggg" />
      <HotChat nickname="행복한 눈멍이" content="ggg" />
    </BoxContainer>
  );
}
