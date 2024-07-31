import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
interface AuthState {
  isLoggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
  // access token의 username을 zustand에 초기화
  currentUsername: string;
  // 닉네임 변경 페이지에서 닉네임 바꾸면 setCurrentUsername을 쓰세요
  setCurrentUsername: (username: string) => void;
}

const useAuthStore = create<AuthState>()(
  devtools((set) => {
    const token = localStorage.getItem('authorization');
    const isLoggedIn = token ? true : false;
    const currentUsername = token ? jwtDecode(token).username : '';
    return {
      isLoggedIn,
      setLoggedIn: (status) => set({ isLoggedIn: status }),
      currentUsername,
      setCurrentUsername: (username) => set({ currentUsername: username }),
    };
  })
);

export default useAuthStore;
