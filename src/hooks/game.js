// src/hooks/game.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export async function submitGameScore({ slug = 'line4thon', gameId, nickname, score, success }) {
  try {
    await axios.post(
      `${BASE_URL}/${slug}/games/${gameId}/clear`,
      {},
      {
        params: {
          nickname,
          score,
          success,
        },
      }
    );
  } catch (err) {
    console.error('❌ API 요청 오류:', err);
    throw err;
  }
}
