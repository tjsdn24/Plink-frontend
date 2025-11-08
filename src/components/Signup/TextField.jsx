import styled from 'styled-components';
import { c, f } from '../../styles/themeUtils';

const TextFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
  width: 100%;
`;

const Label = styled.label`
  font-family: ${f('typography.body01.family')};
  font-size: ${f('typography.body01.size')};
  font-weight: ${f('typography.body01.weight')};
  color: ${c('neutral.black')};
  line-height: 24px;
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
  padding: 12px ${({ $hasIcon }) => ($hasIcon ? '48px' : '16px')} 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${c('neutral.gray')};
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
    border-color: ${c('brand.pink')};
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

const IconButton = styled.button`
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

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.5;
  }
`;

const HelperText = styled.span`
  font-family: ${f('typography.body01.family')};
  font-size: ${f('typography.body01.size')};
  font-weight: ${f('typography.body01.weight')};
  color: rgba(44, 50, 73, 0.5);
  line-height: normal;
  padding-left: 4px;
`;

export default function TextField({
  label,
  placeholder,
  helperText,
  type = 'text',
  value,
  onChange,
  name,
  disabled = false,
  icon,
  onIconClick,
  ...props
}) {
  const hasIcon = !!icon;

  return (
    <TextFieldContainer>
      {label && <Label htmlFor={name}>{label}</Label>}
      <InputWrapper>
        <InputContainer>
          <Input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            $hasIcon={hasIcon}
            {...props}
          />
          {icon && (
            <IconButton type="button" onClick={onIconClick} disabled={disabled}>
              <img src={icon} alt="아이콘" />
            </IconButton>
          )}
        </InputContainer>
        {helperText && <HelperText>{helperText}</HelperText>}
      </InputWrapper>
    </TextFieldContainer>
  );
}
