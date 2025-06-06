// 🔗 axios 인스턴스 (accessToken 자동 포함)
import axiosInstance from "../../api/axiosInstance";
import axios from "axios";

const AUTH_SERVER_URL = import.meta.env.VITE_AUTH_SERVER_URL;

/**
 * ✅ 로그인 상태 확인 API
 * @param {Object} options
 * @param {boolean} options.allowRefresh - refreshToken 사용 여부
 */
export const checkLoginStatusAPI = async ({ allowRefresh = false } = {}) => {
  const token = localStorage.getItem("accessToken");
  const hasRefreshToken = document.cookie.includes("refreshToken");

  // accessToken 없고 refreshToken이 있을 경우 → refresh 시도
  if (!token && allowRefresh && hasRefreshToken) {
    try {
      const refreshResponse = await axios.post(
        AUTH_SERVER_URL + "/api/auth/refresh",
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-destination': 'assist',
          },
        }
      );

      if (refreshResponse.data?.success && refreshResponse.data?.response) {
        const newAccessToken = refreshResponse.data.response;
        localStorage.setItem("accessToken", newAccessToken);

        const checkResponse = await axiosInstance.get(
          AUTH_SERVER_URL + "/api/auth/check",
          { headers: { 'x-destination': 'assist' } }
        );

        return checkResponse.data?.success && checkResponse.data?.response?.isLogin;
      }
    } catch (err) {
      console.error("🚨 refresh 실패:", err);
      localStorage.removeItem("accessToken");
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return false;
    }
  }

  // accessToken이 여전히 없으면 false
  if (!localStorage.getItem("accessToken")) return false;

  try {
    const response = await axiosInstance.get(
      AUTH_SERVER_URL + "/api/auth/check",
      { headers: { 'x-destination': 'assist' } }
    );
    return response.data?.success && response.data?.response?.isLogin;
  } catch (error) {
    console.error("🚨 accessToken 검사 실패:", error);
    return false;
  }
};

/**
 * ✅ 로그아웃 API
 * - 서버에 refreshToken 쿠키 삭제 요청
 * - 클라이언트에 저장된 accessToken 제거
 */
export const logoutAPI = async () => {
  try {
    const response = await axiosInstance.post(
      AUTH_SERVER_URL + "/api/auth/logout",
      {},
      { headers: { destination: "assist" } }
    );

    if (response.data.success) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("developerId");
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    return response.data.success;
  } catch (error) {
    console.error("🚨 로그아웃 실패:", error);
    return false;
  }
};
