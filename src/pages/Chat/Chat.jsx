import { useState } from 'react';
import styled from 'styled-components';
import Search from '../../components/Chat//Search';
import ChatCatagory from '../../components/Chat/ChatCatagory';
import Post from '../../components/Chat/Post';
import WriteButton from '../../components/Chat/WriteButton';
import WritePost from '../../components/Chat/WritePost';

export default function Chat() {
  const [openWrite, setOpenWrite] = useState(false);

  return (
    <ChatWrapper>
      <Search />
      <ChatCatagory />
      <Post />
      <WriteButton onClick={() => setOpenWrite(true)} />
      {openWrite && <WritePost onClose={() => setOpenWrite(false)} />}
    </ChatWrapper>
  );
}

const ChatWrapper = styled.div``;
