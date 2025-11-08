import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { c, f } from '../../styles/themeUtils';
import PageHeader from '../../components/PageHeader';
import SignUpTitle from '../../components/Signup/SignUpTitle';
import NavButton from '../../components/Signup/NavButton';
import successIcon from '../../assets/icons/PasswordTrue.svg';
import errorIcon from '../../assets/icons/PasswordFalse.svg';
import EyeOpen from '../../assets/icons/EyeOpen.svg';
import EyeClosed from '../../assets/icons/EyeClosed.svg';

function PasswordTextField({ 
  name, 
  placeholder, 
  helperText, 
  value, 
  onChange, 
  status,
  isVisible,
  onToggleVisibility
}) {
  const statusIconSrc = status === 'success' ? successIcon : status === 'error' ? errorIcon : null;
  const toggleIcon = isVisible ? EyeOpen : EyeClosed;

  return (
    <TextFieldContainer>
      <InputWrapper>
        <InputContainer>
          <Input
            id={name}
            name={name}
            type={isVisible ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            $hasToggle
            $status={status}
          />
          <ToggleButton type="button" onClick={onToggleVisibility}>
            <img src={toggleIcon} alt={isVisible ? '비밀번호 숨기기' : '비밀번호 표시'} />
          </ToggleButton>
        </InputContainer>
        {helperText && (
          <HelperText $status={status}>
            {helperText}
            {statusIconSrc && (
              <img
                src={statusIconSrc}
                alt={status === 'success' ? '성공' : '에러'}
                style={{ marginLeft: 6, verticalAlign: 'middle', width: 16, height: 16 }}
              />
            )}
          </HelperText>
        )}
      </InputWrapper>
    </TextFieldContainer>
  );
}

export default function ChangePassword() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  const [visibility, setVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    newPasswordConfirm: false,
  });

  const [fieldStatus, setFieldStatus] = useState({
    currentPassword: null, // null | 'success' | 'error'
    newPassword: null,
    newPasswordConfirm: null,
  });

  const [helperMessages, setHelperMessages] = useState({
    currentPassword: '현재 비밀번호를 입력해주세요.',
    newPassword: '영문/숫자/특수문자로 8자 이상 작성해주세요.',
    newPasswordConfirm: '변경할 비밀번호를 다시 입력해주세요.',
  });

  const DEFAULT_PASSWORD = 'abcd1234!';
  const [storedCurrentPassword, setStoredCurrentPassword] = useState(
    () => localStorage.getItem('userPassword') || DEFAULT_PASSWORD
  );

  // 비밀번호 유효성 검사
  const validatePassword = (password) => {
    // 영문, 숫자 포함, 8자 이상
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 8;
    
    return hasLetter && hasNumber && isLongEnough;
  };

  useEffect(() => {
    // 현재 비밀번호 검증
    if (formData.currentPassword) {
      const isValid = formData.currentPassword === storedCurrentPassword;
      setFieldStatus(prev => ({
        ...prev,
        currentPassword: isValid ? 'success' : 'error',
      }));
      setHelperMessages(prev => ({
        ...prev,
        currentPassword: isValid
          ? '현재 비밀번호가 확인되었습니다.'
          : '사용 중인 비밀번호가 아닙니다.',
      }));
    } else {
      setFieldStatus(prev => ({
        ...prev,
        currentPassword: null,
      }));
      setHelperMessages(prev => ({
        ...prev,
        currentPassword: '현재 비밀번호를 입력해주세요.',
      }));
    }
  }, [formData.currentPassword, storedCurrentPassword]);

  useEffect(() => {
    // 새 비밀번호 검증
    if (formData.newPassword) {
      const isValid = validatePassword(formData.newPassword);
      setFieldStatus(prev => ({
        ...prev,
        newPassword: isValid ? 'success' : 'error',
      }));
      setHelperMessages(prev => ({
        ...prev,
        newPassword: isValid 
          ? '사용 가능한 비밀번호입니다!' 
          : '사용 불가능한 비밀번호입니다.',
      }));
    } else {
      setFieldStatus(prev => ({
        ...prev,
        newPassword: null,
      }));
      setHelperMessages(prev => ({
        ...prev,
        newPassword: '영문/숫자/특수문자로 8자 이상 작성해주세요.',
      }));
    }
  }, [formData.newPassword]);

  useEffect(() => {
    // 비밀번호 확인 검증
    if (formData.newPasswordConfirm) {
      const isValid = formData.newPassword === formData.newPasswordConfirm && formData.newPassword !== '';
      setFieldStatus(prev => ({
        ...prev,
        newPasswordConfirm: isValid ? 'success' : 'error',
      }));
      setHelperMessages(prev => ({
        ...prev,
        newPasswordConfirm: isValid 
          ? '비밀번호가 일치합니다.' 
          : '비밀번호가 일치하지 않습니다.',
      }));
    } else {
      setFieldStatus(prev => ({
        ...prev,
        newPasswordConfirm: null,
      }));
      setHelperMessages(prev => ({
        ...prev,
        newPasswordConfirm: '변경할 비밀번호를 다시 입력해주세요.',
      }));
    }
  }, [formData.newPasswordConfirm, formData.newPassword]);

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredCurrentPassword(localStorage.getItem('userPassword') || DEFAULT_PASSWORD);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleVisibility = (field) => {
    setVisibility(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const isAllFieldsValid =
    fieldStatus.currentPassword === 'success' &&
    fieldStatus.newPassword === 'success' &&
    fieldStatus.newPasswordConfirm === 'success';

  const handleBack = () => {
    navigate('/mypage');
  };

  const handleSubmit = () => {
    if (isAllFieldsValid) {
      localStorage.setItem('userPassword', formData.newPassword);
      setStoredCurrentPassword(formData.newPassword);
      setFormData({
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      });
      setFieldStatus({
        currentPassword: null,
        newPassword: null,
        newPasswordConfirm: null,
      });
      setHelperMessages({
        currentPassword: '현재 비밀번호를 입력해주세요.',
        newPassword: '영문/숫자/특수문자로 8자 이상 작성해주세요.',
        newPasswordConfirm: '변경할 비밀번호를 다시 입력해주세요.',
      });
      navigate('/mypage', {
        state: {
          newPassword: formData.newPassword,
          newPasswordConfirm: formData.newPasswordConfirm,
        },
      });
    }
  };

  return (
    <div>
      <PageHeader title="My" onBack={handleBack} />
      <SignUpTitle title={
          <>
            비밀번호 변경을 위해<br />
            아래 정보를 입력해주세요.
          </>
        }
      />
      <FieldsContainer>
        <PasswordTextField
          name="currentPassword"
          placeholder="현재 비밀번호"
          helperText={helperMessages.currentPassword}
          value={formData.currentPassword}
          onChange={handleChange}
          status={fieldStatus.currentPassword}
          isVisible={visibility.currentPassword}
          onToggleVisibility={() => handleToggleVisibility('currentPassword')}
        />
        <PasswordTextField
          name="newPassword"
          placeholder="변경할 비밀번호"
          helperText={helperMessages.newPassword}
          value={formData.newPassword}
          onChange={handleChange}
          status={fieldStatus.newPassword}
          isVisible={visibility.newPassword}
          onToggleVisibility={() => handleToggleVisibility('newPassword')}
        />
        <PasswordTextField
          name="newPasswordConfirm"
          placeholder="비밀번호 확인"
          helperText={helperMessages.newPasswordConfirm}
          value={formData.newPasswordConfirm}
          onChange={handleChange}
          status={fieldStatus.newPasswordConfirm}
          isVisible={visibility.newPasswordConfirm}
          onToggleVisibility={() => handleToggleVisibility('newPasswordConfirm')}
        />
      </FieldsContainer>
      <NavButton isActive={isAllFieldsValid} onClick={handleSubmit}>변경하기</NavButton>
    </div>
  );
}

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TextFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  position: relative;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px ${({ $hasToggle }) => ($hasToggle ? '48px' : '16px')} 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ $status, theme }) => {
    if ($status === 'success') return theme.colors.sub.green;
    if ($status === 'error') return theme.colors.sub.red;
    return theme.colors.neutral.gray;
  }};
  background: ${c('neutral.white')};
  font-family: ${f('typography.body01.family')};
  font-size: ${f('typography.body01.size')};
  font-weight: ${f('typography.body01.weight')};
  color: ${c('neutral.black')};
  line-height: 24px;
  box-sizing: border-box;
  outline: none;

  &::placeholder {
    color: ${c('neutral.gray2')};
  }

  &:focus {
    border-color: ${({ $status, theme }) => {
      if ($status === 'success') return theme.colors.sub.green;
      if ($status === 'error') return theme.colors.sub.red;
      return theme.colors.brand.pink;
    }};
  }

  &:disabled {
    background: ${c('neutral.bg')};
    cursor: not-allowed;
  }

  &::-ms-reveal,
  &::-ms-clear {
    display: none;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;

  img {
    width: 24px;
    height: 24px;
    pointer-events: none;
  }
`;

const HelperText = styled.span`
  font-family: ${f('typography.body02.family')};
  font-size: ${f('typography.body02.size')};
  font-weight: ${f('typography.body02.weight')};
  color: ${({ $status, theme }) => {
    if ($status === 'success') return theme.colors.sub.green;
    if ($status === 'error') return theme.colors.sub.red;
    return 'rgba(44, 50, 73, 0.5)';
  }};
  line-height: normal;
  padding-left: 4px;
`;