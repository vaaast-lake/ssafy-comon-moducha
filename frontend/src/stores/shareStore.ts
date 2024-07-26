import { create } from 'zustand';
import { ShareListItem, ShareList } from '../types/ShareType';

interface ShareState {
  shareList: ShareListItem[];
  setShareList: (fetchedShareList: ShareList) => void;
}

export const useShareStore = create<ShareState>((set) => ({
  shareList: [],
  pageInfo: {},
  setShareList: (fetchedShareList) =>
    set({ shareList: fetchedShareList.data.items }),
}));
