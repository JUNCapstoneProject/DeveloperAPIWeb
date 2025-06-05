import axios from "axios";

// const baseURL = import.meta.env.VITE_API_BASE_URL;
const AUTH_SERVER_URL = import.meta.env.VITE_AUTH_SERVER_URL;

console.log("🚀 axiosInstance 초기화 시작", { AUTH_SERVER_URL });

// ✅ 1. Axios 인스턴스 생성 (기본 설정 포함)
// axiosInstance는 모든 API 요청에 공통적으로 사용할 axios 인스턴스입니다.
// baseURL: 모든 요청의 기본 URL로 사용됩니다.
// withCredentials: 쿠키(특히 refreshToken)를 요청에 포함시킵니다.
const axiosInstance = axios.create({
  baseURL: AUTH_SERVER_URL,
  withCredentials: true, // ✅ 쿠키 전송 허용 (refreshToken 쿠키 포함됨)
});

console.log("✅ axiosInstance 생성 완료");

// ✅ 2. 요청 인터셉터: accessToken 자동으로 Authorization 헤더에 추가
// 모든 요청 전에 실행되어 localStorage에 저장된 accessToken을 Authorization 헤더에 추가합니다.
axiosInstance.interceptors.request.use(async (config) => {
  console.log("🔍 요청 인터셉터 실행됨");

  const token = localStorage.getItem("accessToken"); // accessToken을 localStorage에서 가져옴

  // 쿠키 확인 로직 개선
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const refreshTokenCookie = cookies.find((cookie) =>
    cookie.startsWith("refreshToken=")
  );
  const hasRefreshToken = !!refreshTokenCookie;

  console.log("🔍 쿠키 상세 정보:", {
    allCookies: cookies,
    refreshTokenCookie,
    hasRefreshToken,
    cookieString: document.cookie,
  });

  console.log("🔍 요청 인터셉터 디버깅:", {
    hasAccessToken: !!token,
    hasRefreshToken,
    isRefreshing,
    currentCookie: document.cookie,
    url: config.url,
    config,
  });

  // accessToken이 없고 refreshToken이 있는 경우
  if (!token && hasRefreshToken && !isRefreshing) {
    console.log("🔄 refreshToken으로 새로운 accessToken 요청 시작");
    isRefreshing = true;
    try {
      // refresh API 호출
      const res = await axios.post(
        AUTH_SERVER_URL + "/api/auth/refresh",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-destination": "assist"
          },
          credentials: "include",
        }
      );

      console.log("✅ refresh API 응답:", res.data);

      if (res.data?.success && res.data?.response) {
        const newAccessToken = res.data.response;
        localStorage.setItem("accessToken", newAccessToken);
        config.headers.Authorization = newAccessToken;
        console.log("✅ 새로운 accessToken 저장 및 헤더 설정 완료");
      }
    } catch (error) {
      console.error("❌ refreshToken 갱신 실패:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("developerId");
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } finally {
      isRefreshing = false;
    }
  } else if (token) {
    config.headers.Authorization = `${token}`; // accessToken을 Authorization 헤더에 추가
  }
  return config;
});

// === 🔄 토큰 갱신 관련 변수 ===
let isRefreshing = false; // 현재 refresh 요청이 진행 중인지 여부
let refreshSubscribers = []; // refresh 완료 후 재시도할 요청들의 콜백 함수 배열

// refresh가 완료되면 대기 중인 모든 요청에 새 토큰을 전달
function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

// refresh가 끝나길 기다리는 요청의 콜백을 배열에 추가
function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

// ✅ 3. 응답 인터셉터: accessToken이 만료되었을 경우 자동으로 refresh 요청
// 모든 응답에서 401(Unauthorized) 에러가 발생하면 accessToken을 갱신하고,
// 갱신된 토큰으로 원래 요청을 재시도합니다.
axiosInstance.interceptors.response.use(
  (response) => {
    // 성공적인 응답은 그대로 반환
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이면서, 이미 재시도한 요청이 아니면
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // 현재 refresh 요청이 없으면 refresh 요청을 보냄
      if (!isRefreshing) {
        isRefreshing = true;
        console.log("refresh 요청 (401)");
        console.log("현재 쿠키:", document.cookie);
        try {
          // refreshToken을 이용해 accessToken 재발급 요청
          const res = await axios.post(
            AUTH_SERVER_URL + "/api/auth/refresh",
            {},
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "x-destination": "assist"
              },
              credentials: "include",
            }
          );

          console.log("refresh API 응답 전체:", res);
          console.log("refresh API 응답 데이터:", res.data);
          console.log("refresh API 응답 구조:", {
            success: res.data?.success,
            accessToken: res.data?.accessToken,
            response: res.data?.response,
          });

          if (res.data?.success && res.data?.response) {
            // Bearer 접두사가 포함된 토큰을 그대로 저장
            const newAccessToken = res.data.response;
            localStorage.setItem("accessToken", newAccessToken);
            onRefreshed(newAccessToken);
            isRefreshing = false;

            // 원래 요청 재시도 (Bearer 접두사 포함)
            originalRequest.headers.Authorization = newAccessToken;
            const retryResponse = await axiosInstance(originalRequest);

            // 재시도한 요청이 여전히 401을 반환하면 로그아웃 처리
            if (retryResponse.status === 401) {
              console.error("❌ 토큰 갱신 후에도 인증 실패: 로그아웃 처리");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("developerId");
              document.cookie =
                "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              return Promise.reject(new Error("인증 실패"));
            }

            return retryResponse;
          } else {
            throw new Error(res.data?.message || "토큰 갱신 실패");
          }
        } catch (refreshError) {
          console.error("❌ refreshToken도 만료됨: 로그아웃 처리 필요");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("developerId");
          document.cookie =
            "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

      // refresh가 끝날 때까지 대기 후, 새 토큰으로 원래 요청 재시도
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers.Authorization = newToken;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
