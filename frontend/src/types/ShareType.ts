import { PaginationDTO } from './PaginationType';

export interface ShareListItem {
  boardId: number;
  title: string;
  createdDate: string;
  lastUpdated: string;
  endDate: string;
  maxParticipants: number;
  participants: number;
  nickName: string;
  viewCount: number;
}

export interface ShareDTO {
  message: string;
  pagination: PaginationDTO;
  data: ShareListItem[];
}

// 상속
export interface ShareDetailItem extends ShareListItem {
  content: string;
}

export interface ShareDetail {
  message: string;
  data: ShareDetailItem;
}
