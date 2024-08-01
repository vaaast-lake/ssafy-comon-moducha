import axiosInstance from './axiosInstance';

export const fetchShareList = (sort: string, page: number, perPage: number) => {
  return axiosInstance.get('/shares', {
    params: { sort, page, perPage },
  });
};

export const fetchShareDetail = (shareId: string) => {
  return axiosInstance.get(`/shares/${shareId}`);
};
