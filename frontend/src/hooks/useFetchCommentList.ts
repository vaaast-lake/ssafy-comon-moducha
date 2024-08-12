import { useEffect, useState } from 'react';
import { fetchCommentList } from '../api/fetchComment';
import { BoardType } from '../types/BoardType';
import { Comment } from '../types/CommentType';

const useFetchCommentList = (boardType: BoardType, boardId: number) => {
  const [commentList, setCommentList] = useState<Comment[]>([]);
  useEffect(() => {
    fetchCommentList({
      boardType,
      boardId,
      page: 1,
      perPage: 10,
    })
      .then((res) => {
        if (res.status === 200) {
          setCommentList(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  return { commentList, setCommentList };
};

export default useFetchCommentList;
