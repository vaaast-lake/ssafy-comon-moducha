import axiosInstance from './axios';

interface CommentRequestOption {
  boardType: 'shares' | 'teatimes';
  articleId: string;
  page: number;
  limit: number;
}

export const fetchCommentList = ({
  boardType,
  articleId,
  page,
  limit,
}: CommentRequestOption) => {
  return axiosInstance.get(`/${boardType}/${articleId}/comments`, {
    params: { page, limit },
  });
};

export const fetchReplyList = () => {};
