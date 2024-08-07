import axios, { AxiosError, AxiosResponse, AxiosInstance } from 'axios';
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

// refresh token도 만료되면 로그아웃 시키기
function logoutLogic(): void {
  console.log('accessToken reissue에 실패하여 로그아웃합니다');
  const { setCurrentUsername } = useAuthStore.getState();
  localStorage.removeItem('authorization');
  setCurrentUsername('');
  alert('로그인이 만료되었습니다. 재로그인이 필요합니다.');
  window.location.href = '/login';
}
// request 인터셉터(done) - 작동여부 체크
axiosInstance.interceptors.request.use(
  // 액세스 토큰을 헤더에 추가
  function (config) {
    const token = localStorage.getItem('authorization');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  // request error 시 수행할 작업
  function (error) {
    console.log('error at request interceptor: ' + error);
    return Promise.reject(error);
  }
);

// response 인터셉터
axiosInstance.interceptors.response.use(
  // status 401일 때 accessToken reissue
  function (response: AxiosResponse) {
    // 200대 status 일때 이 함수를 트리거 - 비워두면 됩니다.
    return response;
  },
  async (error: AxiosError) => {
    // 액세스 토큰이 만료되어 401 오류 발생 시 - #반드시 재요청 고려#
    if (error.response?.status === 401) {
      try {
        await tokenRefresh(axiosInstance); // 정상 작동시 localStorage에 갱신된 accessToken이 저장됩니다
        // 갱신된 accessToken으로 request 재요청
        const accessToken = localStorage.getItem('authorization');
        if (accessToken && error.config) {
          error.config.headers.Authorization = `Bearer  ${accessToken}`;
          return axiosInstance(error.config);
        }
      } catch (refreshError) {
        logoutLogic();
        return Promise.reject(refreshError);
      }
      // 401 error response 이후, 토큰 갱신 뒤 재요청
      return Promise.reject(error);
    }
  }
);

// 리프레시 토큰으로 액세스 토큰을 갱신하는 함수
const tokenRefresh = async (instance: AxiosInstance) => {
  try {
    const response = await instance.post(
      '/reissue',
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const newAccessToken = response.data.accessToken;
    if (!newAccessToken) {
      console.log(
        '리프레시 토큰을 통해 액세스 토큰을 재발급하지 못했습니다. axios interceptor의 문제이거나 재로그인이 필요합니다'
      );
      return;
    }
    localStorage.setItem('authorization', newAccessToken);
  } catch (error) {
    console.error('리프레시 토큰 요청 중 오류 발생:', error);
    throw error;
  }
};

export default axiosInstance;
