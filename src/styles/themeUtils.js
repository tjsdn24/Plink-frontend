// themeUtils.js
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
