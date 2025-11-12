import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ChatArrowLeft from '../../assets/icons/ChatArrowLeft.svg';
import { Wrapper, Header, BackButton, HeaderTitle } from '../../components/Chat/Comments.styles';
import styled from 'styled-components';

export default function PostEdit() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { post } = state || {};
  const { slug, commentId } = useParams();

  const [content, setContent] = useState(
    Array.isArray(post?.content) ? post.content.find(item => item.type === 'text')?.data || '' : ''
  );

  const handleSave = () => {
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    // ✅ 실제로는 수정 API 호출이 들어갈 자리입니다.
    console.log('수정된 내용:', content);
    console.log('slug:', slug);
    console.log('commentId:', commentId);

    alert('게시글이 수정되었습니다.');
    navigate(-1); // 이전 페이지로 이동
  };

  if (!post) {
    return <div>게시글 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <img src={ChatArrowLeft} alt="back" />
        </BackButton>
        <HeaderTitle>게시글 수정</HeaderTitle>
      </Header>

      <EditContainer>
        <EditLabel>내용</EditLabel>
        <EditTextarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="수정할 내용을 입력하세요."
        />
        <SaveButton onClick={handleSave}>수정 완료</SaveButton>
      </EditContainer>
    </Wrapper>
  );
}

// 스타일 정의
const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 12px;
`;

const EditLabel = styled.label`
  font-size: 15px;
  color: #555;
`;

const EditTextarea = styled.textarea`
  width: 100%;
  min-height: 180px;
  resize: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 15px;
  outline: none;
  &:focus {
    border-color: #ff80ab;
  }
`;

const SaveButton = styled.button`
  align-self: flex-end;
  background-color: #ff80ab;
  color: white;
  font-size: 15px;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  cursor: pointer;
  transition: 0.2s ease;
  &:hover {
    opacity: 0.9;
  }
`;
