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
import { changePassword as changePasswordApi } from '../../api/mypageService';

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 비밀번호 유효성 검사
  const validatePassword = (password) => {
    // 영문, 숫자 포함, 8자 이상
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 8;
    
    return hasLetter && hasNumber && isLongEnough;
  };

  useEffect(() => {
    // 현재 비밀번호 입력 확인 (실제 검증은 백엔드에서 수행)
    if (formData.currentPassword) {
      const hasValue = formData.currentPassword.trim() !== '';
      setFieldStatus(prev => ({
        ...prev,
        currentPassword: hasValue ? null : null, // 백엔드에서 검증하므로 null로 유지
      }));
      setHelperMessages(prev => ({
        ...prev,
        currentPassword: hasValue
          ? '현재 비밀번호를 입력했습니다.'
          : '현재 비밀번호를 입력해주세요.',
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
  }, [formData.currentPassword]);

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
    formData.currentPassword.trim() !== '' &&
    fieldStatus.newPassword === 'success' &&
    fieldStatus.newPasswordConfirm === 'success';

  const handleBack = () => {
    navigate('/mypage');
  };

  const normalizeSlug = slug => {
    if (typeof slug !== 'string') return null;
    const trimmed = slug.trim();
    if (!trimmed) return null;
    if (trimmed === 'line4thon') {
      try {
        localStorage.setItem('userSlug', 'line4thon');
      } catch {
        // ignore storage errors
      }
      return 'line4thon';
    }
    return trimmed;
  };

  const handleSubmit = async () => {
    if (!isAllFieldsValid || isSubmitting) {
      return;
    }

    // 로그인 상태 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userId = localStorage.getItem('userId');
    
    if (!isLoggedIn || !userId) {
      window.alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
      return;
    }

    const slug =
      (() => {
        try {
          const stored = localStorage.getItem('userSlug');
          const normalized = normalizeSlug(stored);
          return normalized || 'line4thon';
        } catch {
          return 'line4thon';
        }
      })();

    setIsSubmitting(true);

    try {
      console.log('비밀번호 변경 API 호출 전 확인:', {
        isLoggedIn,
        userId,
        slug,
      });

      await changePasswordApi({
        slug,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      // 성공 시 localStorage 업데이트
      localStorage.setItem('userPassword', formData.newPassword);

      // 폼 초기화
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

      window.alert('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/mypage');
    } catch (error) {
      const errorStatus = error?.response?.status || error?.status;
      const errorData = error?.response?.data || error?.data;
      
      let message =
        errorData?.message ||
        error?.data?.message ||
        error?.message ||
        '비밀번호 변경에 실패했습니다. 다시 시도해주세요.';

      // 401 UNAUTHORIZED 에러 처리 (현재 비밀번호 불일치)
      if (errorStatus === 401) {
        setFieldStatus(prev => ({
          ...prev,
          currentPassword: 'error',
        }));
        setHelperMessages(prev => ({
          ...prev,
          currentPassword: message || '현재 비밀번호가 올바르지 않습니다.',
        }));
        message = message || '현재 비밀번호가 올바르지 않습니다.';
      }

      // 403 Forbidden 에러 처리 (인증/권한 문제)
      if (errorStatus === 403) {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userId = localStorage.getItem('userId');
        
        console.error('403 Forbidden - 세션 확인:', {
          isLoggedIn,
          userId,
          slug,
          error: error?.response?.data || error?.data,
        });
        
        if (isLoggedIn && userId) {
          message = '세션이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.';
          if (window.confirm('세션이 만료되었습니다. 로그인 페이지로 이동하시겠습니까?')) {
            navigate('/login');
            return;
          }
        } else {
          message = '로그인이 필요합니다. 로그인 페이지로 이동합니다.';
          navigate('/login');
          return;
        }
      }

      console.error('비밀번호 변경 실패:', {
        status: errorStatus,
        message,
        error,
      });
      window.alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <ContentWrapper>
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
      </ContentWrapper>
      <NavButton 
        isActive={isAllFieldsValid && !isSubmitting} 
        onClick={handleSubmit}
        disabled={!isAllFieldsValid || isSubmitting}
      >
        {isSubmitting ? '변경 중...' : '변경하기'}
      </NavButton>
    </Container>
  );
}

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