import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoginStatus } from "./redux/features/authSlice";
import { checkLoginStatusAPI } from "./redux/features/authAPI";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const checkLogin = async () => {
      const cameFromExternal =
        document.referrer === "" || !document.referrer.includes(window.location.origin);

      console.log("🔍 외부 유입 여부:", cameFromExternal);
      console.log("🔍 document.referrer:", document.referrer);
      console.log("🔍 current origin:", window.location.origin);

      const isLogin = await checkLoginStatusAPI({
        allowRefresh: cameFromExternal
      });

      console.log("🔍 로그인 상태 확인 결과:", isLogin);
      dispatch(setLoginStatus(isLogin));
    };

    checkLogin();
  }, [dispatch, location]);

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
