import { create } from 'zustand';
import axiosInstance from '../api/axios';

interface ShareState {
  shareList: object;
  fetchShareList: () => void;
}

export const useShareStore = create<ShareState>((set) => ({
  shareList: [],
  fetchShareList: () => set((state)=>({shareList: state.shareList })),
}));
