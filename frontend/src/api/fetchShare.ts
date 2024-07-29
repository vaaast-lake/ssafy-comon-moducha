import axiosInstance from './axios';

export const fetchShareList = (sort: string, page: number, limit: number) => {
  return axiosInstance.get('/shares', {
    params: { sort, page, limit },
  });
};

export const fetchShareDetail = (shareId: string | undefined) => {
  return axiosInstance.get(`/shares/${shareId}`);
};

export const fetchShareCommentList = (shareId: string | undefined) => {
  return axiosInstance.get(`/shares/${shareId}/comments`);
};
