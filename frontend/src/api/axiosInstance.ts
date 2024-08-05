import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import useAuthStore from '../stores/authStore';
/**
 * axiosInstance.ts
 *  axios 인스턴스를 생성하고, 액세스 토큰이 만료된 경우 리프레시 토큰으로 새 액세스 토큰을 발급받는 로직을 처리합니다.
 *  로그인 관련 요청 등에는 이 axios 인스턴스를 사용하지 않아 성능을 향상시킬 수 있습니다.
 */

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// 액세스 토큰을 로컬 스토리지에서 가져오는 함수
const getAccessToken = (): string | null => {
  return localStorage.getItem('authorization');
};
// 액세스 토큰을 로컬 스토리지에 저장하는 함수
const setAccessToken = (token: string) => {
  localStorage.setItem('authorization', token);
};

// 리프레시 토큰으로 액세스 토큰을 갱신하는 함수
const refreshAccessToken = async (): Promise<string> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/reissue`,
      {},
      {
        withCredentials: true,
      }
    );
    const newAccessToken = response.data.accessToken;
    if (!newAccessToken) {
      throw new Error('새 액세스 토큰이 없습니다.'); // 백엔드 response를 분석해서 newAccessToken을 고치면 됩니다.
    }
    setAccessToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    throw new Error('에러: 토큰 갱신 불가');
  }
};

// 요청 인터셉터: 모든 요청에 액세스 토큰을 헤더에 추가합니다.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 응답 인터셉터: 401 오류가 발생하면 액세스 토큰을 갱신하고 요청을 재시도합니다.
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // 액세스 토큰이 만료되어 401 오류 발생 시
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        axiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰 갱신 실패 시 - 로그인 페이지로 리다이렉트 및 로그아웃 처리
        const { setLoggedIn, setCurrentUsername } = useAuthStore.getState();
        setLoggedIn(false);
        setCurrentUsername(''); // zustand에서 닉네임을 ''으로 설정
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
