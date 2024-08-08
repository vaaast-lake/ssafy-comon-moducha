import { useEffect, useRef, useState } from 'react';
import { Comment } from '../../types/CommentType';
import CommentListItem from './CommentListItem';
import { fetchCommentList } from '../../api/fetchComment';
import { BoardType } from '../../types/BoardType';
import CommentWrite from './CommentWrite';
import useAuthStore from '../../stores/authStore';

interface Board {
  boardType: BoardType;
  boardId: number;
}

const CommentList = ({ boardType, boardId }: Board) => {
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [fetchParams, setFetchParams] = useState({
    boardType,
    boardId,
    page: 1,
    perPage: 10,
  });
  const sentinel = useRef(null);
  const currentUserId = useAuthStore((state) => state.currentUserId);

  useEffect(() => {
    fetchCommentList(fetchParams)
      .then((res) => {
        setCommentList(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [fetchParams]);

  return (
    <div>
      <header>
        <h1 className="m-2 text-xl font-bold">댓글</h1>
        <hr className="border border-gray-300" />
      </header>
      <CommentWrite {...{ boardType, boardId, setCommentList }} />
      <hr />
      <main>
        {!!commentList.length && (
          <ul>
            {commentList.map((el: Comment) => (
              <CommentListItem
                key={el.commentId}
                {...{ ...el, type: 'comment', boardType, currentUserId, setCommentList }}
              />
            ))}
          </ul>
        )}
      </main>
      <footer className="h-0.5" ref={sentinel} />
    </div>
  );
};

export default CommentList;
