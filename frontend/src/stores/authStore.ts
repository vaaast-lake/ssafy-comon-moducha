import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
// 백엔드에서 accesstoken의 key인 username을 nickname으로 변경하여 코드를 수정하였습니다.
// 프론트엔드에서 currentUsername으로 쓰는 변수는 그대로 유지하였습니다. 따라서 authStore를 참조하는 코드들은 변경할 필요가 없습니다.
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
  nickname: string;
  userId: string;
  role: string;
}

const useAuthStore = create<AuthState>()(
  devtools((set) => {
    const token = localStorage.getItem('authorization');
    const isLoggedIn = token ? true : false;
    const currentUsername = token ? jwtDecode<TokenType>(token).nickname : '';
    const currentUserId = token ? jwtDecode<TokenType>(token).userId : '';
    const currentUserRole = token ? jwtDecode<TokenType>(token).role : '';
    return {
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
