import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
interface AuthState {
  isLoggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
}

const useAuthStore = create<AuthState>()(
  devtools((set) => ({ // redux devtools 활용을 위해 devtools 사용
  isLoggedIn: false,
  setLoggedIn: (status) => set({ isLoggedIn: status }),
})));

export default useAuthStore;