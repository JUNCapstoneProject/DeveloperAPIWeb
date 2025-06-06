import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from 'react-router-dom';
import {
  setLoginStatus,
  setAccessToken,
} from "./redux/features/authSlice";
import { checkLoginStatusAPI } from "./redux/features/authAPI";

// 페이지 컴포넌트
import Navbar from './components/common/navbar';
import Home from './pages/Home';
import Apply from './pages/Apply';
import Explain from './pages/Explain';
import MyAPI from './pages/MyAPI';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EmailVerification from './pages/Emailverification';
import ResetPassword from './pages/ResetPassword';
import FindPassword from './pages/FindPassword';
import MyPage from './pages/MyPage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const cameFromExternal =
      document.referrer === "" || !document.referrer.includes(location.origin);
    const navEntries = performance.getEntriesByType("navigation");
    const isReload = navEntries[0]?.type === "reload";

    (async () => {
      if (cameFromExternal && document.cookie.includes("refreshToken")) {
        console.log("🌐 외부 유입 + refreshToken 존재 → 자동 로그인 시도");
        const loggedIn = await checkLoginStatusAPI({ allowRefresh: true });
        dispatch(setLoginStatus(loggedIn));
        if (loggedIn && token) dispatch(setAccessToken(token));
        return;
      }

      if (isReload) {
        console.log("🔄 새로고침 감지 → 로그인 체크");
        const loggedIn = await checkLoginStatusAPI({ allowRefresh: false });
        dispatch(setLoginStatus(loggedIn));
        if (token) dispatch(setAccessToken(token));
        return;
      }

      if (token) {
        dispatch(setAccessToken(token));
        dispatch(setLoginStatus(true));
        console.log("➡️ 내부 이동 → 토큰으로 로그인 유지");
      } else {
        dispatch(setLoginStatus(false));
        console.log("🚫 내부 이동 → 토큰 없음, 로그인 false");
      }
    })();
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
  );
}

export default App;
