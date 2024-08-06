import { BoardType } from '../types/BoardType';
import apiAxios from './axiosInstance';

interface ArticleList {
  boardType: BoardType;
  sort: string;
  page: number;
  perPage: number;
}

export const fetchArticleList = ({
  boardType,
  sort,
  page,
  perPage,
}: ArticleList) => {
  return apiAxios.get(`/${boardType}`, {
    params: { sort, page, perPage },
  });
};

export const fetchArticleDetail = ({
  boardType,
  boardId,
}: {
  boardType: BoardType;
  boardId: string;
}) => {
  return apiAxios.get(`/${boardType}/${boardId}`);
};
