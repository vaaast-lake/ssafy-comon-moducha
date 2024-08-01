import apiAxios from './apiAxios';

export const fetchShareList = (sort: string, page: number, perPage: number) => {
  return apiAxios.get('/shares', {
    params: { sort, page, perPage },
  });
};

export const fetchShareDetail = (shareId: string) => {
  return apiAxios.get(`/shares/${shareId}`);
};
