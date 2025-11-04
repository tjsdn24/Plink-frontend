import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const nickname = location.state?.nickname || '숨쉬는 고양이';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isAllFieldsFilled =
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.passwordConfirm.trim() !== '';

  const handleBack = () => {
    navigate('/login');
  };

  const handleSubmit = () => {
    if (isAllFieldsFilled) {
      navigate('/signup/complete', {
        state: {
          nickname,
          formData,
        },
      });
    }
  };

  return (
    <div>
      <PageHeader title="회원가입" onBack={handleBack} />
      <SignUpTitle userName={nickname} />
      <FieldsContainer>
        <TextField
          name="email"
          placeholder="이메일 입력"
          helperText="이메일을 입력해주세요."
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          name="password"
          placeholder="비밀번호 입력"
          helperText="비밀번호를 입력해주세요."
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          name="passwordConfirm"
          placeholder="비밀번호 확인"
          helperText="영문/숫자/특수문자로 8자 이상 적어주세요."
          value={formData.passwordConfirm}
          onChange={handleChange}
        />
      </FieldsContainer>
      <NavButton isActive={isAllFieldsFilled} onClick={handleSubmit}>가입하기</NavButton>
    </div>
  );
}
