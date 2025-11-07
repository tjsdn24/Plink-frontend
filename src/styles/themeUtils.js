// src/styles/themeUtils.js
export const c =
  key =>
  ({ theme }) =>
    key.split('.').reduce((acc, k) => acc[k], theme.colors);

export const f =
  key =>
  ({ theme }) =>
    key.split('.').reduce((acc, k) => acc[k], theme.font);

export const s =
  key =>
  ({ theme }) =>
    key.split('.').reduce((acc, k) => acc[k], theme.spacing);

// ✨ typography 세트 한 번에 적용
export const typography =
  key =>
  ({ theme }) => {
    const t = theme.font.typography[key];
    return `
      font-family: ${t.family};
      font-size: ${t.size};
      font-weight: ${t.weight};
    `;
  };
export const shadow = key => theme.shadow[key];
