import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
  currentUsername: string;
  setCurrentUsername: (username: string) => void;
}

const useAuthStore = create<AuthState>()(
  devtools((set) => {
    const token = localStorage.getItem('authorization');
    const isLoggedIn = token ? true : false;

    return {
      isLoggedIn,
      setLoggedIn: (status) => set({ isLoggedIn: status }),
    };
  })
);

export default useAuthStore;
