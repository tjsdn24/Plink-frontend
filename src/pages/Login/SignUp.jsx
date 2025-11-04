import { useState } from 'react';
import styled from 'styled-components';
import SignUpHeader from './SignUpHeader';
import TextField from './TextField';
import SignUpTitle from './SignUpTitle';
import NavButton from './NavButton';

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export default function SignUp() {
  const [formData, setFormData] = useState({
    nickname: '',
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
    formData.nickname.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.passwordConfirm.trim() !== '';

  return (
    <div>
      <SignUpHeader />
      <SignUpTitle />
      <FieldsContainer>
        <TextField
          name="nickname"
          placeholder="이메일 입력"
          helperText="이메일 주소를 입력해주세요."
          value={formData.nickname}
          onChange={handleChange}
        />
        <TextField
          name="password"
          placeholder="비밀번호 입력"
          helperText="영문/숫자/특수문자로 8자 이상 적어주세요."
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          name="passwordConfirm"
          placeholder="비밀번호 확인"
          helperText="비밀번호를 다시 입력해주세요"
          value={formData.passwordConfirm}
          onChange={handleChange}
        />
      </FieldsContainer>
      <NavButton isActive={isAllFieldsFilled}>가입하기</NavButton>
    </div>
  );
}
  