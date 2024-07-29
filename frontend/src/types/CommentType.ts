import { PaginationDTO } from './PaginationType';

export interface Comment {
  commentId: number;
  boardId: number;
  content: string;
  createdDate: string;
  nickname: string;
  replyCount: number;
}

export interface CommentDTO {
  data: Comment[];
  pagination: PaginationDTO;
}
