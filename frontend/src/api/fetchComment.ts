import { BoardType } from '../types/BoardType';
import axiosInstance from './axios';

interface CommentRequestOption {
  boardType: BoardType;
  boardId?: number;
  page: number;
  limit: number;
}

interface ReplyRequestOption extends CommentRequestOption {
  commentId: number;
}

export const fetchCommentList = ({
  boardType,
  boardId,
  page,
  limit,
}: CommentRequestOption) => {
  return axiosInstance.get(`/${boardType}/${boardId}/comments`, {
    params: { page, limit },
  });
};

export const fetchReplyList = ({
  boardType,
  boardId,
  commentId,
  page,
  limit,
}: ReplyRequestOption) => {
  return axiosInstance.get(
    `/${boardType}/${boardId}/comments/${commentId}/replies`,
    {
      params: { page, limit },
    }
  );
};
