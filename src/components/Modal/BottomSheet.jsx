import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${c('neutral.black2')};
  display: flex;
  flex-direction: column;
  position: ${({ $isOverlay }) => ($isOverlay ? 'fixed' : 'relative')};
  top: ${({ $isOverlay }) => ($isOverlay ? 0 : 'auto')};
  left: ${({ $isOverlay }) => ($isOverlay ? 0 : 'auto')};
  right: ${({ $isOverlay }) => ($isOverlay ? 0 : 'auto')};
  bottom: ${({ $isOverlay }) => ($isOverlay ? 0 : 'auto')};
  z-index: ${({ $isOverlay }) => ($isOverlay ? 2000 : 'auto')};
`;

const BlurredBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${c('neutral.black2')};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1;
  will-change: transform;
  transform: translateZ(0);
`;

const BackgroundContent = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.5;
  filter: blur(8px);
  z-index: 0;
  pointer-events: none;
  will-change: transform;
  transform: translateZ(0);
`;

const StyledBackgroundWrapper = styled.div`
  filter: blur(8px);
  opacity: 0.6;
`;

const BottomSheetContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${c('neutral.white')};
  border-radius: 24px 24px 0 0;
  padding: ${s('lg')} ${s('md')} ${s('xl')};
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
  z-index: 10;
  will-change: transform;
  
  @keyframes slideUp {
    from {
      transform: translateY(100%) translateZ(0);
    }
    to {
      transform: translateY(0) translateZ(0);
    }
  }
`;

const DragHandle = styled.div`
  width: 40px;
  height: 4px;
  background: ${c('neutral.gray')};
  border-radius: 2px;
  margin: 0 auto ${s('md')};
`;

const Title = styled.h1`
  ${typography('headline01')};
  color: ${c('neutral.black')};
  margin-bottom: ${({ $spacing }) => s($spacing || 'xl')};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: ${s('sm')};
  margin-bottom: ${({ $spacing }) => s($spacing || 'xl')};
`;

const Emoji = styled.div`
  margin-bottom: ${s('sm')};
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-size: 64px;

  img {
    width: 64px;
    height: 64px;
  }
`;

const MainMessage = styled.h2`
  font-family: ${({ theme }) => theme.font.typography.display01.family};
  font-size: ${({ theme }) => theme.font.typography.display01.size};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  color: ${c('neutral.black')};
  text-align: center;
  margin: 0;
`;

const SubMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $align }) => $align || 'flex-start'};
  gap: 2px;
  margin-top: 0;
  border: none;
  padding: 0;
  width: 100%;
`;

const SubText = styled.p`
  font-family: ${({ theme }) => theme.font.typography.body01.family};
  font-size: ${({ theme }) => theme.font.typography.body01.size};
  font-weight: ${({ theme }) => theme.font.typography.body01.weight};
  color: ${c('neutral.black2')};
  text-align: ${({ $textAlign }) => $textAlign || 'left'};
  line-height: 1.28;
  margin: 0;
`;

const ButtonContainer = styled.div`
  margin-top: auto;
  padding-top: ${s('lg')};
  width: 100%;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 20px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${({ disabled }) => (disabled ? c('neutral.gray') : c('brand.pink'))};
  color: ${({ disabled }) => (disabled ? 'rgba(44, 50, 73, 0.50)' : c('neutral.white'))};
  ${typography('label01')};
  text-align: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ disabled }) => (disabled ? c('neutral.gray') : c('brand.darkPink'))};
  }

  &:active {
    background: ${({ disabled }) => (disabled ? c('neutral.gray') : c('brand.darkPink'))};
  }
`;

/**
 * 재사용 가능한 BottomSheet 모달 컴포넌트
 * @param {string} title - 하단 시트 제목
 * @param {ReactNode|string} emoji - 이모지 (이미지 경로, React 컴포넌트, 텍스트 이모지 등)
 * @param {string} emojiIcon - 이모지 아이콘 경로 (하위 호환성을 위해 유지, emoji가 우선)
 * @param {string} emojiAlt - 이모지 alt 텍스트 (이미지일 경우)
 * @param {string} mainMessage - 메인 메시지
 * @param {string[]} subMessages - 서브 메시지 배열
 * @param {string} buttonText - 버튼 텍스트
 * @param {function} onButtonClick - 버튼 클릭 핸들러
 * @param {boolean} buttonDisabled - 버튼 비활성화 여부 (기본값: false)
 * @param {ReactNode} backgroundContent - 배경에 표시할 콘텐츠 (선택적)
 * @param {boolean} showDragHandle - 드래그 핸들 표시 여부 (기본값: true)
 * @param {ReactNode} children - 커스텀 콘텐츠 (선택적)
 * @param {boolean} isOverlay - 화면 전체 오버레이 여부 (기본값: false)
 * @param {string} headerSpacing - 제목과 본문 사이 간격 키 (기본값: 'xl')
 * @param {string} contentSpacing - 본문과 버튼 사이 간격 키 (기본값: 'xl')
 */
export default function BottomSheet({
  title,
  emoji,
  emojiIcon,
  emojiAlt,
  mainMessage,
  subMessages = [],
  subMessagesAlign = 'flex-start',
  subMessagesTextAlign = 'left',
  buttonText,
  onButtonClick,
  buttonDisabled = false,
  backgroundContent,
  showDragHandle = true,
  children,
  isOverlay = false,
  headerSpacing = 'xl',
  contentSpacing = 'xl',
}) {
  // 이모지 렌더링 로직
  const renderEmoji = () => {
    // emoji prop이 있으면 우선 사용
    if (emoji) {
      // 문자열인 경우 (이미지 경로 또는 텍스트 이모지)
      if (typeof emoji === 'string') {
        // 이미지 경로인 경우 (.svg, .png, .jpg, .webp 확장자 포함)
        if (emoji.includes('.svg') || emoji.includes('.png') || emoji.includes('.jpg') || emoji.includes('.webp') || emoji.startsWith('/') || emoji.startsWith('http')) {
          return <img src={emoji} alt={emojiAlt || ''} />;
        }
        // 텍스트 이모지인 경우
        return emoji;
      }
      // React 컴포넌트나 다른 형태
      return emoji;
    }
    // 하위 호환성: emojiIcon 사용
    if (emojiIcon) {
      return <img src={emojiIcon} alt={emojiAlt || ''} />;
    }
    return null;
  };

  const emojiContent = renderEmoji();
  return (
    <PageContainer $isOverlay={isOverlay}>
      {backgroundContent && (
        <BackgroundContent>
          <StyledBackgroundWrapper>{backgroundContent}</StyledBackgroundWrapper>
        </BackgroundContent>
      )}
      <BlurredBackground />
      <BottomSheetContainer>
        {showDragHandle && <DragHandle />}
        {title && <Title $spacing={headerSpacing}>{title}</Title>}
        <Content $spacing={contentSpacing}>
          {emojiContent && <Emoji>{emojiContent}</Emoji>}
          {mainMessage && <MainMessage>{mainMessage}</MainMessage>}
          {subMessages.length > 0 && (
            <SubMessage $align={subMessagesAlign}>
              {subMessages.map((text, index) => (
                <SubText key={index} $textAlign={subMessagesTextAlign}>
                  {text}
                </SubText>
              ))}
            </SubMessage>
          )}
          {children}
        </Content>
        {buttonText && (
          <ButtonContainer>
            <ActionButton onClick={onButtonClick} disabled={buttonDisabled}>
              {buttonText}
            </ActionButton>
          </ButtonContainer>
        )}
      </BottomSheetContainer>
    </PageContainer>
  );
}

