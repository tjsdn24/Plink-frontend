import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// ✅ 페이지 import
import Home from '../pages/Home/Home';
// import Login from "../pages/Login/Login";
// import MyPage from "../pages/MyPage/MyPage";
import Photo from '../pages/Photo/Photo';
// import Game from "../pages/Game/Game";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 홈 (기본 레이아웃 적용) */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        {/* 로그인 페이지 (Header, Navbar 제외 예정)
        <Route path="/login" element={<Login />} /> */}
        {/*  마이페이지 (Header + Navbar 유지)
        <Route
          path="/mypage"
          element={
            <MainLayout>
              <MyPage />
            </MainLayout>
          }
        /> */}
        {/* 사진 관련 페이지 (Header + Navbar 유지) */}
        <Route
          path="/photo"
          element={
            <MainLayout>
              <Photo />
            </MainLayout>
          }
        />
        {/* 게임 관련 페이지 (Header + Navbar 유지)
        <Route
          path="/game"
          element={
            <MainLayout>
              <Game />
            </MainLayout>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
}
