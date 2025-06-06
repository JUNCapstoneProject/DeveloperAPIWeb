// 🔗 axios 인스턴스 (accessToken 자동 포함, 응답 인터셉터 포함)
import axiosInstance from "../../api/axiosInstance";
import axios from "axios";

const AUTH_SERVER_URL = import.meta.env.VITE_AUTH_SERVER_URL;

/**
 * ✅ 로그인 상태 확인 API
 * - accessToken이 유효한지 확인
 * - accessToken이 없거나 만료되었고 allowRefresh가 true이면 refreshToken으로 재발급 시도
 *
 * @param {Object} options
 * @param {boolean} options.allowRefresh - refreshToken 사용 여부
 */
export const checkLoginStatusAPI = async ({ allowRefresh = false } = {}) => {
  const token = localStorage.getItem("accessToken");
  const hasRefreshToken = document.cookie.includes("refreshToken");

  // accessToken이 없고 refresh도 안 하기로 했으면 false
  if (!token && !allowRefresh) {
    console.log("🚫 accessToken 없음 & refresh 비허용 → false 반환");
    return false;
  }

  // accessToken이 없고 refresh 허용인 경우
  if (!token && allowRefresh && hasRefreshToken) {
    try {
      console.log("🔁 accessToken 없음 → refresh 시도");
      const refreshResponse = await axios.post(
        AUTH_SERVER_URL + "/api/auth/refresh",
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-destination': 'assist'
          },
          credentials: 'include'
        }
      );

      if (refreshResponse.data?.success && refreshResponse.data?.response) {
        const newAccessToken = refreshResponse.data.response;
        localStorage.setItem("accessToken", newAccessToken);

        const checkResponse = await axiosInstance.get(AUTH_SERVER_URL + "/api/auth/check", {
          headers: { 'x-destination': 'assist' }
        });

        return checkResponse.data?.success && checkResponse.data?.response?.isLogin;
      }
    } catch (err) {
      console.error("❌ refreshToken 로그인 실패:", err);
      localStorage.removeItem("accessToken");
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return false;
    }
  }

  // accessToken이 있는 경우 → 유효성 체크
  try {
    const response = await axiosInstance.get(AUTH_SERVER_URL + "/api/auth/check", {
      headers: { 'x-destination': 'assist' }
    });

    if (response.data?.success && response.data?.response?.isLogin !== undefined) {
      if (!response.data.response.isLogin && allowRefresh && hasRefreshToken) {
        console.warn("⛔ accessToken 만료 → refresh 시도");

        try {
          const refreshResponse = await axios.post(
            AUTH_SERVER_URL + "/api/auth/refresh",
            {},
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-destination': 'assist'
              },
              credentials: 'include'
            }
          );

          if (refreshResponse.data?.success && refreshResponse.data?.response) {
            const newAccessToken = refreshResponse.data.response;
            localStorage.setItem("accessToken", newAccessToken);

            const checkResponse = await axiosInstance.get(AUTH_SERVER_URL + "/api/auth/check", {
              headers: { 'x-destination': 'assist' }
            });

            return checkResponse.data?.success && checkResponse.data?.response?.isLogin;
          }
        } catch (refreshError) {
          console.error("🚨 토큰 갱신 실패:", refreshError);
          localStorage.removeItem("accessToken");
          document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          return false;
        }
      }

      return response.data.response.isLogin;
    }

    return false;
  } catch (error) {
    if (error.response?.status === 401 && allowRefresh && hasRefreshToken) {
      console.warn("⛔ 401 → refresh 시도");

      try {
        const refreshResponse = await axios.post(
          AUTH_SERVER_URL + "/api/auth/refresh",
          {},
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'x-destination': 'assist'
            },
            credentials: 'include'
          }
        );

        if (refreshResponse.data?.success && refreshResponse.data?.response) {
          const newAccessToken = refreshResponse.data.response;
          localStorage.setItem("accessToken", newAccessToken);

          const checkResponse = await axiosInstance.get(AUTH_SERVER_URL + "/api/auth/check", {
            headers: { 'x-destination': 'assist' }
          });

          return checkResponse.data?.success && checkResponse.data?.response?.isLogin;
        }
      } catch (refreshError) {
        console.error("🚨 토큰 갱신 실패:", refreshError);
        localStorage.removeItem("accessToken");
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        return false;
      }
    } else {
      console.error("🚨 기타 오류:", error);
      return false;
    }
  }
};

/**
 * ✅ 로그아웃 API
 * - 서버에 refreshToken 삭제 요청
 * - 클라이언트 accessToken/쿠키 제거
 */
export const logoutAPI = async () => {
  console.log("logoutAPI 실행");

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
