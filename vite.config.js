import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [
    svgrPlugin(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    mkcert(), //  자동 HTTPS 인증서 생성
  ],
  define: {
    global: 'globalThis',
  },
  server: {
    https: true, // dev server를 HTTPS로 실행
    port: 5173,
  },
});
