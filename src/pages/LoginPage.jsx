import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";
import { setLoginStatus } from "../redux/features/authSlice";
import "./LoginPage.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from || "/";

  useEffect(() => {
    const syncLoginStatus = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_AUTH_SERVER_URL}/api/auth/check`, {
            headers: {
              Authorization: token
            }
          });
          if (response.data?.success && response.data?.response?.isLogin) {
            dispatch(setLoginStatus(true));
          } else {
            dispatch(setLoginStatus(false));
          }
        } catch {
          dispatch(setLoginStatus(false));
        }
      } else {
        dispatch(setLoginStatus(false));
      }
    };

    syncLoginStatus();
    window.addEventListener("focus", syncLoginStatus);
    return () => window.removeEventListener("focus", syncLoginStatus);
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get("redirectUrl") || "/";

      const requestBody = { email, password };

      const response = await axiosInstance.post(
        `/api/auth/login?redirectUrl=${encodeURIComponent(redirectUrl)}`,
        requestBody
      );

      const { success, response: responseData, error: apiError } = response.data;

      if (success && responseData) {
        localStorage.setItem("accessToken", responseData.accessToken);
        if (responseData.user && responseData.user.developerId) {
          localStorage.setItem("developerId", responseData.user.developerId);
        }
        dispatch(setLoginStatus(true));

        // developerId 생성 API 호출
        try {
          const devIdRes = await axios.post(
            `${API_BASE_URL}/api/auth/register`,
            {
              accessToken: responseData.accessToken.replace('Bearer ', ''),
            },
          );
          localStorage.setItem("developerId", devIdRes.data.response.user.developerId);
        } catch {
          // 예외 처리
        }

        const redirectTo = responseData.redirectUrl || "/";
        if (redirectTo.startsWith("http://") || redirectTo.startsWith("https://")) {
          window.location.href = redirectTo;
        } else {
          navigate(redirectTo);
        }
      } else {
        setError(apiError?.message || "아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    } catch (err) {
      const apiMessage = err.response?.data?.error?.message;
      if (apiMessage) {
        setError(apiMessage);
      } else {
        setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>로그인</h2>
        <p>계정에 로그인하세요</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-submit-btn">
            로그인
          </button>
        </form>

        <p className="signup-link">
          계정이 없으신가요?{" "}
          <button 
            onClick={() => navigate("/signup", { state: { from } })} 
            className="signup-link-button"
          >
            회원가입
          </button>
        </p>

        <p className="findpw-link">
          <button
            onClick={() => navigate("/find-password")}
            className="findpw-link-button"
          >
            비밀번호를 잊으셨나요?
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
