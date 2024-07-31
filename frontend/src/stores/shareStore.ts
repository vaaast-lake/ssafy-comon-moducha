import { create } from 'zustand';
import { ShareListItem, ShareDTO } from '../types/ShareType';

interface ShareState {
  shareList: ShareListItem[];
  setShareList: (fetchedShareList: ShareDTO) => void;
}

export const useShareStore = create<ShareState>((set) => ({
  shareList: [],
  pageInfo: {},
  setShareList: (fetchedShareList) =>
    set({ shareList: fetchedShareList.data.items }),
}));
