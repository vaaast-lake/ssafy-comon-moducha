import { PaginationDTO } from './PaginationType';

export interface TeatimeListItem {
  userId: number;
  boardId: number;
  title: string;
  content: string;
  createdDate: string;
  lastUpdated: string;
}

export interface TeatimeDTO {
  message: string;
  pagination: PaginationDTO;
  data: TeatimeListItem[];
}

// 상속
export interface TeatimeDetailItem extends TeatimeListItem {
  broadcastDate: string;
  maxParticipants: number;
  endDate: string;
  viewCount: number;
  participants: number;
  nickName: string;
  title: string;
}

export interface TeatimeDetail {
  message: string;
  data: TeatimeDetailItem;
}
