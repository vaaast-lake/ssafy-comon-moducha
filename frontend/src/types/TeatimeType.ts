import { PaginationDTO } from './PaginationType';

export interface TeatimeListItem {
  userId: string;
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
  nickname: string;
  title: string;
  picture: string;
}
