import { Pagination } from './Pagination';

export type ShareItem = {
  shareBoardId: number;
  title: string;
  createdDate: string;
  lastUpdated: string;
  endDate: string;
  maxParticipants: number;
  participants: number;
};

export type ShareJson = {
  pagination: Pagination;
  items: ShareItem[];
};
