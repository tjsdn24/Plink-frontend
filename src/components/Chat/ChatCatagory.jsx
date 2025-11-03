import styled from 'styled-components';

export default function ChatCatagory() {
  return (
    <ChatCatagoryWrapper>
      <Catagory>전체</Catagory>
      <Catagory>만남/동행</Catagory>
      <Catagory>정보/공유</Catagory>
      <Catagory>질문/요청</Catagory>
      <Catagory>분실물</Catagory>
      <Catagory>굿즈/이벤트</Catagory>
      <Catagory>푸드/맛집</Catagory>
    </ChatCatagoryWrapper>
  );
}

const ChatCatagoryWrapper = styled.div`
  margin: 10px;
  display: flex;
`;

const Catagory = styled.button`
  margin: 10px;
`;
