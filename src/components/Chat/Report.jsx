import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import BottomSheet from '../Modal/BottomSheet';
import NavButton from '../Signup/NavButton';
import ChatIcon from '../../assets/icons/HomeTalk.svg';
import AlertIcon from '../../assets/icons/ChatAlert.svg';
import { c, s, typography } from '../../styles/themeUtils';
import { reportPostOrComment } from '../../api/Chat/CommentsApi';

const REPORT_REASONS = [
  '스팸/홍보/도배 글이에요',
  '욕설/혐오 표현이 포함되어 있어요',
  '개인정보 노출이 걱정돼요',
  '불법 정보 또는 음란물이에요',
  '기타 문제가 있어요',
];

const REASON_SUMMARY_MAP = {
  '스팸/홍보/도배 글이에요': '스팸 또는 광고성 콘텐츠',
  '욕설/혐오 표현이 포함되어 있어요': '욕설 또는 혐오 표현',
  '개인정보 노출이 걱정돼요': '개인정보 노출 우려',
  '불법 정보 또는 음란물이에요': '불법 정보 또는 음란물',
  '기타 문제가 있어요': '기타 문제 신고',
};

export default function Report({
  onClose,
  targetId, // 신고할 게시글/댓글 ID
  targetType = 'post', // 'post' 또는 'comment'
  postId, // 댓글 신고 시 필요한 게시글 ID
}) {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { slug } = useParams();

  const isStepOne = step === 1;
  const isStepTwo = step === 2;
  const isStepThree = step === 3;

  const summaryMessage = REASON_SUMMARY_MAP[selectedReason] || selectedReason;
  const mainMessage = isStepOne
    ? '신고 사유를 선택해주세요'
    : isStepTwo
      ? summaryMessage
      : '신고가 접수되었어요.';
  const subMessages = isStepOne
    ? ['허위 신고 시 이용이 제한될 수 있어요.']
    : isStepTwo
      ? [
          '신고 내용 접수 후 가이드라인에 따라 검토를 합니다.',
          '추가적인 내용을 알려주시면 처리에 도움이 됩니다.',
        ]
      : ['즐거운 축제를 위해 도와주셔서 감사합니다.', '더 나은 서비스를 제공하겠습니다.'];
  const emoji = isStepThree ? (
    <EmojiImage src={AlertIcon} alt="신고 완료" />
  ) : isStepTwo ? (
    <EmojiImage src={ChatIcon} alt="신고 안내" />
  ) : undefined;
  const buttonLabel = isStepOne
    ? '다음 단계로 (1/2)'
    : isStepTwo
      ? isSubmitting
        ? '신고 중...'
        : '신고하기'
      : '확인';
  const isButtonActive = isStepOne ? Boolean(selectedReason) : !isSubmitting;

  const handleReasonSelect = reason => {
    setSelectedReason(reason);
  };

  const handleAction = async () => {
    if (isStepOne) {
      if (!selectedReason) {
        alert('신고 사유를 선택해주세요.');
        return;
      }
      setStep(2);
      return;
    }

    if (isStepTwo) {
      try {
        setIsSubmitting(true);

        // API에 보낼 데이터 구성
        const reportData = {
          targetId, // 신고 대상 ID
          targetType, // 'post' 또는 'comment'
          reason: selectedReason,
          details: additionalDetails,
        };

        // 댓글 신고인 경우 postId 추가
        if (targetType === 'comment' && postId) {
          reportData.postId = postId;
        }

        console.log('=== 신고 API 호출 시작 ===');
        console.log('slug:', slug);
        console.log('reportData:', reportData);

        // API 호출
        const response = await reportPostOrComment(slug, reportData);

        console.log('=== 신고 API 응답 성공 ===');
        console.log('response:', response);

        setStep(3);
      } catch (error) {
        console.error('=== 신고 제출 실패 ===');
        console.error('error:', error);
        console.error('error.response:', error.response);
        console.error('error.response.data:', error.response?.data);
        alert('신고 제출에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Step 3: 완료 후 초기화 및 닫기
    setSelectedReason('');
    setAdditionalDetails('');
    setStep(1);
    onClose();
    navigate('/chat');
  };

  return (
    <BottomSheet
      title="신고하기"
      emoji={emoji}
      mainMessage={mainMessage}
      subMessages={subMessages}
      isOverlay
      headerSpacing={isStepThree ? 'xl' : 'lg'}
      contentSpacing="lg"
    >
      {isStepOne && (
        <ReasonList>
          {REPORT_REASONS.map(reason => (
            <ReasonButton
              key={reason}
              type="button"
              $selected={selectedReason === reason}
              onClick={() => handleReasonSelect(reason)}
            >
              {reason}
            </ReasonButton>
          ))}
        </ReasonList>
      )}
      {isStepTwo && (
        <StepTwoContainer>
          <SelectedReasonBadge>{summaryMessage}</SelectedReasonBadge>
          <DetailTextarea
            placeholder="추가적인 내용을 알려주세요."
            value={additionalDetails}
            onChange={event => setAdditionalDetails(event.target.value)}
          />
        </StepTwoContainer>
      )}
      {isStepThree && <SuccessSpacer />}
      <NavButton isActive={isButtonActive} disabled={!isButtonActive} onClick={handleAction}>
        {buttonLabel}
      </NavButton>
    </BottomSheet>
  );
}

const ReasonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('sm')};
  width: 100%;
  margin-top: ${s('lg')};
  align-self: stretch;
`;

const ReasonButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ $selected }) => ($selected ? c('brand.pink') : c('neutral.gray'))};
  background: ${({ $selected }) => ($selected ? '#FFF0F7' : c('neutral.white'))};
  color: ${c('neutral.black')};
  ${typography('body01')};
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    border-color: ${c('brand.pink')};
  }
`;

const StepTwoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('md')};
  width: 100%;
  align-self: stretch;
  margin-top: ${s('lg')};
`;

const SelectedReasonBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: #fff0f7;
  color: ${c('brand.pink')};
  ${typography('label02')};
`;

const SuccessSpacer = styled.div`
  height: ${s('xl')};
`;

const EmojiImage = styled.img`
  width: 64px;
  height: 64px;
`;

const DetailTextarea = styled.textarea`
  width: 100%;
  min-height: 140px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${c('neutral.gray')};
  background: ${c('neutral.white')};
  color: ${c('neutral.black')};
  ${typography('body02')};
  resize: none;
  outline: none;
  line-height: 1.5;

  &::placeholder {
    color: ${c('neutral.gray2')};
  }
`;
