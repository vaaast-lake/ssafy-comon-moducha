import { BoardType } from '../types/BoardType';
import apiAxios from './apiAxios';

interface CommentRequestOption {
  boardType: BoardType;
  boardId?: number;
  page: number;
  perPage: number;
}

interface ReplyRequestOption extends CommentRequestOption {
  commentId: number;
}

export const fetchCommentList = ({
  boardType,
  boardId,
  page,
  perPage,
}: CommentRequestOption) => {
  return apiAxios.get(`/${boardType}/${boardId}/comments`, {
    params: { page, perPage },
  });
};

export const fetchReplyList = ({
  boardType,
  boardId,
  commentId,
  page,
  perPage,
}: ReplyRequestOption) => {
  return apiAxios.get(
    `/${boardType}/${boardId}/comments/${commentId}/replies`,
    {
      params: { page, perPage },
    }
  );
};
