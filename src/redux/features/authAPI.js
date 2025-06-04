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

export const checkLoginStatusAPI = async () => {
  const token = localStorage.getItem("accessToken");
  const hasRefreshToken = document.cookie.includes("refreshToken");

  // accessToken이 없지만 refreshToken이 있는 경우
  if (!token && hasRefreshToken) {
    try {
      // refresh API 호출
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
        // check API를 다시 호출
        const checkResponse = await axiosInstance.get(AUTH_SERVER_URL + "/api/auth/check", {
          headers: {
            'x-destination': 'assist'
          }
        });
        return checkResponse.data?.success && checkResponse.data?.response?.isLogin;
      }
    } catch (refreshError) {
      console.error("🚨 토큰 갱신 실패:", refreshError);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("developerId");
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return false;
    }
  }

  if (!token) return false;

  try {
    const response = await axiosInstance.get(AUTH_SERVER_URL + "/api/auth/check", {
      headers: {
        'x-destination': 'assist'
      }
    });
    
    // 새로운 응답 구조 처리
    if (response.data?.success && response.data?.response?.isLogin !== undefined) {
      if (!response.data.response.isLogin) {
        try {
          // refresh API 호출 (직접 axios 사용)
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
            // Bearer 접두사가 포함된 토큰을 그대로 저장
            const newAccessToken = refreshResponse.data.response;
            localStorage.setItem("accessToken", newAccessToken);
            // check API를 다시 호출
            const checkResponse = await axiosInstance.get(AUTH_SERVER_URL + "/api/auth/check", {
              headers: {
                'x-destination': 'assist'
              }
            });
            
            // check 요청이 실패하면 로그아웃 처리
            if (!checkResponse.data?.success || !checkResponse.data?.response?.isLogin) {
              console.error("❌ 토큰 갱신 후에도 인증 실패: 로그아웃 처리");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("developerId");
              document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              return false;
            }
            
            return checkResponse.data?.success && checkResponse.data?.response?.isLogin;
          } else {
            throw new Error(refreshResponse.data?.message || "토큰 갱신 실패");
          }
        } catch (refreshError) {
          console.error("🚨 토큰 갱신 실패:", refreshError.response?.data || refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("developerId");
          document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          return false;
        }
      }
      return response.data.response.isLogin;
    }

    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("⛔ 유효하지 않은 토큰입니다. 토큰 갱신을 시도합니다.");
      try {
        console.log("현재 쿠키:", document.cookie);
        // refresh API 호출 (직접 axios 사용)
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
        
        console.log("refresh API 응답 전체:", refreshResponse);
        console.log("refresh API 응답 데이터:", refreshResponse.data);
        console.log("refresh API 응답 구조:", {
          success: refreshResponse.data?.success,
          accessToken: refreshResponse.data?.accessToken,
          response: refreshResponse.data?.response
        });
        
        if (refreshResponse.data?.success && refreshResponse.data?.response) {
          // Bearer 접두사가 포함된 토큰을 그대로 저장
          const newAccessToken = refreshResponse.data.response;
          localStorage.setItem("accessToken", newAccessToken);
          // check API를 다시 호출
          const checkResponse = await axiosInstance.get(AUTH_SERVER_URL + "/api/auth/check", {
            headers: {
              'x-destination': 'assist'
            }
          });
          
          // check 요청이 실패하면 로그아웃 처리
          if (!checkResponse.data?.success || !checkResponse.data?.response?.isLogin) {
            console.error("❌ 토큰 갱신 후에도 인증 실패: 로그아웃 처리");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("developerId");
            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            return false;
          }
          
          return checkResponse.data?.success && checkResponse.data?.response?.isLogin;
        } else {
          console.error("🚨 토큰 갱신 실패:", refreshResponse.data?.message || "알 수 없는 오류");
        }
      } catch (refreshError) {
        console.error("🚨 토큰 갱신 실패:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("developerId");
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    } else {
      console.error("🚨 서버 오류 발생:", error);
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