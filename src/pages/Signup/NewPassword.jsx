import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageHeader from '../../components/PageHeader';
import TextField from '../../components/Signup/TextField';
import SignUpTitle from '../../components/Signup/SignUpTitle';
import NavButton from '../../components/Signup/NavButton';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: 100px;
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export default function NewPassword() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    newPasswordConfirm: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isAllFieldsFilled =
    formData.newPassword.trim() !== '' &&
    formData.newPasswordConfirm.trim() !== '';

  const handleBack = () => {
    navigate('/signup/auth');
  };

  const handleSubmit = () => {
    if (isAllFieldsFilled) {
      navigate('/signup/newcomplete', {
        state: {
          newPassword: formData.newPassword,
          formData,
        },
      });
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <PageHeader title="비밀번호 찾기" onBack={handleBack} />
        <SignUpTitle title={
            <>
              새로 사용할<br />
              비밀번호를 입력해주세요.
            </>
          }
        />
        <FieldsContainer>
          <TextField
            name="newPassword"
            placeholder="새 비밀번호"
            helperText="영문/숫자/특수문자로 8자 이상 작성해주세요."
            value={formData.newPassword}
            onChange={handleChange}
          />
          <TextField
            name="newPasswordConfirm"
            placeholder="새 비밀번호 확인"
            helperText="새 비밀번호로 다시 입력해주세요."
            value={formData.newPasswordConfirm}
            onChange={handleChange}
          />
        </FieldsContainer>
      </ContentWrapper>
      <NavButton isActive={isAllFieldsFilled} onClick={handleSubmit}>변경하기</NavButton>
    </Container>
  );
}
