// 🔗 axios 인스턴스 (accessToken 자동 포폴, 응답 인터셰터 포함)
import axiosInstance from "../../api/axiosInstance"; 
import axios from "axios";

const AUTH_SERVER_URL = import.meta.env.VITE_AUTH_SERVER_URL;

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

/**
 * ✅ 로그인 상태 확인 API
 * - 클라이언트에 저장된 accessToken을 헤더에 포함해 서버에 요청
 * - 서버가 accessToken의 유효성 검사
 * - 필요시 refreshToken으로 accessToken 자동 재발금됩니다 (axios 인터셰터 가장)
 * 
 * 사용 위치:
 * - App.jsx (앱 시작 시)
 * - Navbar.jsx (처음 렌더링 시)
 */

export const checkLoginStatusAPI = async ({ allowRefresh = false } = {}) => {
  const token = localStorage.getItem("accessToken");


  // ✅ 외부 유입 + accessToken 없음 + refreshToken 있음 → 바로 refresh 시도
  if (allowRefresh) {
    console.log("🔄 외부 유입 & accessToken 없음 → refresh 시도");
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

      console.log("✅ refresh 응답:", refreshResponse.data);

      if (refreshResponse.data?.success && refreshResponse.data?.response) {
        const newAccessToken = refreshResponse.data.response;
        localStorage.setItem("accessToken", newAccessToken);
        console.log("✅ 새 accessToken 저장 완료:", newAccessToken);

        const checkResponse = await axiosInstance.get(AUTH_SERVER_URL + "/api/auth/check", {
          headers: { 'x-destination': 'assist' }
        });

        console.log("✅ check 결과:", checkResponse.data);
        return checkResponse.data?.success && checkResponse.data?.response?.isLogin;
      }
    } catch (err) {
      console.error("🚨 [외부유입 refresh] 실패:", err);
      localStorage.removeItem("accessToken");
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return false;
    }
  }

  // ✅ 기존 로직 유지
  if (!token) return false;

  try {
    const response = await axiosInstance.get(AUTH_SERVER_URL + "/api/auth/check", {
      headers: { 'x-destination': 'assist' }
    });

    if (response.data?.success && response.data?.response?.isLogin !== undefined) {
      if (!response.data.response.isLogin) {
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

            if (!checkResponse.data?.success || !checkResponse.data?.response?.isLogin) {
              console.error("❌ 토큰 갱신 후에도 인증 실패");
              localStorage.removeItem("accessToken");
              document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              return false;
            }

            return checkResponse.data?.success && checkResponse.data?.response?.isLogin;
          }
        } catch (refreshError) {
          console.error("🚨 토큰 재갱신 실패:", refreshError);
          localStorage.removeItem("accessToken");
          document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          return false;
        }
      }

      return response.data.response.isLogin;
    }

    return false;
  } catch (error) {
    if (error.response?.status === 401) {
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

          if (!checkResponse.data?.success || !checkResponse.data?.response?.isLogin) {
            localStorage.removeItem("accessToken");
            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            return false;
          }

          return checkResponse.data?.success && checkResponse.data?.response?.isLogin;
        }
      } catch (refreshError) {
        console.error("🚨 refresh 401 실패:", refreshError);
        localStorage.removeItem("accessToken");
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    } else {
      console.error("🚨 check API 에러:", error);
    }

    return false;
  }
};


/**
 * ✅ 로그아웃 API
 * - 서버에 refreshToken 쿠키 삭제 요청
 * - 클라이언트에 저장된 accessToken도 제거
 * 
 * 사용 위치:
 * - Navbar.jsx → 로그아웃 버튼 클릭 시
 */

export const logoutAPI = async () => {
  console.log("logoutAPI 실행");
  try {
    // AUTH_SERVER_URL을 사용하여 로그아웃 요청
    const response = await axiosInstance.post(
      AUTH_SERVER_URL + "/api/auth/logout",
      {},
      {
        headers: {
          destination: "assist"
        }
      }
    );

    if (response.data.success) {
      // 로컬 스토리지 정리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("developerId");
      
      // 쿠키 정리
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    return response.data.success;
  } catch (error) {
    console.error("🚨 로그아웃 오류:", error);
    return false;
  }
};
