// src/styles/theme.js
export const theme = {
  colors: {
    // 🎀 브랜드 메인 컬러
    brand: {
      pink: '#F9409E', // main
      lightPink: '#FC78C9',
      darkPink: '#D13284',
    },

    // ⚫ 중립 계열 (텍스트, 배경, 카드 등)
    neutral: {
      black: '#1A1D2D', // 메인 글씨
      black2: '#2C3249', // 보조 글씨
      bg: '#F7F8FF', // 배경
      gray: '#DDE1F0', // 구분선/비활성화
      white: '#FFFFFF', // 카드
    },

    // 🌈 서브 컬러 (상태/강조)
    sub: {
      blue: '#00CFFF', // 보조 버튼/강조
      yellow: '#FFD600', // 주의/관심
      green: '#1E8E3E', // 긍정
      red: '#FF4155', // 오류
    },
  },

  font: {
    family: {
      display: "'Gmarket Sans', sans-serif",
      text: "'Pretendard', system-ui, sans-serif",
    },

    weight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },

    // ✨ Typography 세트 (family + size + weight 묶음)
    typography: {
      display01: {
        family: "'Gmarket Sans', sans-serif",
        size: '24px',
        weight: 700, // Bold — 메인화면 타이틀
      },
      display02: {
        family: "'Gmarket Sans', sans-serif",
        size: '24px',
        weight: 500, // Medium — 섹션 타이틀
      },
      pink01: {
        family: "'Gmarket Sans', sans-serif",
        size: '36px',
        weight: 700, // Bold — 핑크색 타이틀
      },
      pink02: {
        family: "'Gmarket Sans', sans-serif",
        size: '20px',
        weight: 900, // ExtraBold — 핑크색 타이틀
      },
      headline01: {
        family: "'Pretendard', system-ui, sans-serif",
        size: '20px',
        weight: 700, // Bold — 화면 타이틀
      },
      headline02: {
        family: "'Pretendard', system-ui, sans-serif",
        size: '18px',
        weight: 700, // Bold — 콘텐츠/카드 타이틀
      },
      body01: {
        family: "'Pretendard', system-ui, sans-serif",
        size: '16px',
        weight: 400, // Regular — 일반 본문
      },
      label01: {
        family: "'Pretendard', system-ui, sans-serif",
        size: '16px',
        weight: 700, // Bold — 주요 버튼
      },
      body02: {
        family: "'Pretendard', system-ui, sans-serif",
        size: '14px',
        weight: 400, // Regular — 보조 본문
      },
      label02: {
        family: "'Pretendard', system-ui, sans-serif",
        size: '14px',
        weight: 700, // Bold — 보조 버튼
      },
      caption01: {
        family: "'Pretendard', system-ui, sans-serif",
        size: '12px',
        weight: 400, // Regular — 아이콘 하단 텍스트
      },
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    round: '9999px',
  },

  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.15)',
  },
};
