import { create } from 'zustand';
import { ShareItem, ShareJson } from '../types/ShareItem';

interface ShareState {
  shareList: ShareItem[];
  setShareList: (fetchedShareList: ShareJson) => void;
}

export const useShareStore = create<ShareState>((set) => ({
  shareList: [],
  pageInfo: {},
  setShareList: (fetchedShareList) =>
    set({ shareList: fetchedShareList.items }),
}));
