import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// ✅ 페이지 import
import Home from '../pages/Home/Home';
import Photo from '../pages/Photo/Photo';
import PhotoBooth from '../pages/Photo/PhotoBooth';
import Chat from '../pages/Chat/Chat';
import Game from '../pages/Game/Game';
import MyPage from '../pages/MyPage/MyPage';
import Nickname from '../pages/Signup/Nickname';
import Login from '../pages/Login/Login';
import SignUp from '../pages/Signup/SignUp';
import SignUpComplete from '../pages/Signup/SignUpComplete';
import Password from '../pages/Signup/Password';
import Auth from '../pages/Signup/Auth';
import NewPassword from '../pages/Signup/NewPassword';
import NewComplete from '../pages/Signup/NewComplete';
import ChangePassword from '../pages/MyPage/ChangePassword';
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

        {/* 사진 관련 페이지 (Header + Navbar 유지) */}
        <Route
          path="/photo"
          element={
            <MainLayout>
              <Photo />
            </MainLayout>
          }
        />
        <Route
          path="/photobooth"
          element={
            <MainLayout>
              <PhotoBooth />
            </MainLayout>
          }
        />
        {/* 채팅 관련 페이지 (Header + Navbar 유지) */}
        <Route
          path="/chat"
          element={
            <MainLayout>
              <Chat />
            </MainLayout>
          }
        />
        {/* 게임 관련 페이지 (Header + Navbar 유지) */}
        <Route
          path="/game"
          element={
            <MainLayout>
              <Game />
            </MainLayout>
          }
        />
        {/*  마이페이지 (Header + Navbar 유지)*/}
        <Route
          path="/mypage"
          element={
            <MainLayout>
              <MyPage />
            </MainLayout>
          }
        />
        {/* 비밀번호 변경 페이지 (Header 제거, Navbar 유지)*/}
        <Route
          path="/mypage/changepassword"
          element={<ChangePassword />}
        />
        {/* 로그인 페이지 (Header, Navbar 제외 예정)*/}
        <Route path="/login" element={<Login />} />
        {/* 회원가입 페이지 (Header, Navbar 제외 예정)*/}
        <Route path="/signup/nickname" element={<Nickname />} />
        <Route path="/signup/email" element={<SignUp />} />
        <Route path="/signup/complete" element={<SignUpComplete />} />
        <Route path="/signup/password" element={<Password />} />
        <Route path="/signup/auth" element={<Auth />} />
        <Route path="/signup/newpassword" element={<NewPassword />} />
        <Route path="/signup/newcomplete" element={<NewComplete />} />
      </Routes>
    </BrowserRouter>
  );
}
