import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageHeader from '../../components/PageHeader';
import TextField from '../../components/Signup/TextField';
import SignUpTitle from '../../components/Signup/SignUpTitle';
import NavButton from '../../components/Signup/NavButton';

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export default function Password() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
  });

  const handleBack = () => {
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isAllFieldsFilled = formData.email.trim() !== '';

  const handleSubmit = () => {
    if (isAllFieldsFilled) {
      // TODO: 비밀번호 찾기 로직 구현
      navigate('/signup/auth', {
        state: {
          email: formData.email,
        },
      });
    }
  };

  return (
    <div>
      <PageHeader title="비밀번호 찾기" onBack={handleBack} />
      <SignUpTitle 
        title={
          <>
            비밀번호를 재설정할<br />
            이메일 주소를 입력해주세요.
          </>
        }
      />
      <FieldsContainer>
        <TextField
          name="email"
          placeholder="이메일 주소"
          helperText="이메일 주소를 입력해주세요."
          value={formData.email}
          onChange={handleChange}
        />
      </FieldsContainer>
      <NavButton isActive={isAllFieldsFilled} onClick={handleSubmit}>인증 메일 받기</NavButton>
    </div>
  );
}

