import create from 'zustand';
// 7.3 나브바 구현 테스트 파일
interface AuthState {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
  // login: () => set((state) => ({ ...state, isLoggedIn: true })),
  // logout: () => set((state) => ({ ...state, isLoggedIn: false })),
}));
