import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/navbar'
import Home from './pages/Home'
import Apply from './pages/Apply'
import Explain from './pages/Explain'
import MyAPI from './pages/MyAPI'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import EmailVerification from './pages/Emailverification'
import ResetPassword from './pages/ResetPassword'
import FindPassword from './pages/FindPassword'
import MyPage from './pages/MyPage'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoginStatus } from "./redux/features/authSlice";
import { checkLoginStatusAPI } from "./redux/features/authAPI";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 외부 유입인지 판단
    const cameFromExternal =
      document.referrer === "" || !document.referrer.includes(location.origin);

    const checkLogin = async () => {
      if (cameFromExternal) {
        // ✅ 외부 유입 시 refresh 허용 상태로 로그인 체크
        await checkLoginStatusAPI(); // 기존 checkLoginStatusAPI 내부에서 refresh 처리
        // 필요하다면 추가 로직 작성 가능
      } else {
        // 내부 이동 또는 새로고침 시 기존 로직
        await checkLoginStatusAPI();
      }
      // 로그인 상태 갱신
      const isLogin = await checkLoginStatusAPI();
      dispatch(setLoginStatus(isLogin));
    };
    checkLogin();
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<Explain />} />
        <Route path='/usage' element={<Apply />} />
        <Route path='/apps' element={<MyAPI />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/verify' element={<EmailVerification />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/find-password' element={<FindPassword />} />
        <Route path='/mypage' element={<MyPage />} />
      </Routes>
    </div>
  )
}

export default App
