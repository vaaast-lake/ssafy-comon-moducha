import { Pagination } from './PaginationType';

export interface ShareListItem {
  shareBoardId: number;
  title: string;
  createdDate: string;
  lastUpdated: string;
  endDate: string;
  maxParticipants: number;
  participants: number;
}

export interface ShareList {
  message: string;
  data: {
    pagination: Pagination;
    items: ShareListItem[];
  };
}

// 상속
export interface ShareDetailItem extends ShareListItem {
  content: string;
  viewCount: number;
  nickname: string;
}

export interface ShareDetail {
  message: string;
  data: ShareDetailItem;
}
