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
  // currentUserId, currentUserRole 설정,
  //setCurrentUserId, setCurrentUserRole은 만들면 안됩니다.
  currentUserId: string;
  currentUserRole: string;
}

interface TokenType {
  username: string;
  userId: string;
  role: string;
  accessToken: string;
}

const useAuthStore = create<AuthState>()(
  devtools((set) => {
    const accessToken = localStorage.getItem('authorization');
    const isLoggedIn = accessToken ? true : false;
    const currentUsername = accessToken
      ? jwtDecode<TokenType>(accessToken).username
      : '';
    const currentUserId = accessToken
      ? jwtDecode<TokenType>(accessToken).userId
      : '';
    const currentUserRole = accessToken
      ? jwtDecode<TokenType>(accessToken).role
      : '';
    return {
      accessToken,
      isLoggedIn,
      setLoggedIn: (status) => set({ isLoggedIn: status }),
      currentUsername,
      setCurrentUsername: (username) => set({ currentUsername: username }),
      currentUserId,
      currentUserRole,
    };
  })
);

export default useAuthStore;
