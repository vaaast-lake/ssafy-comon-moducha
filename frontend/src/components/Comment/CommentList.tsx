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
  const { currentUserId, isLoggedIn } = useAuthStore((state) => ({
    currentUserId: state.currentUserId,
    isLoggedIn: state.isLoggedIn,
  }));

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
      <CommentWrite
        {...{ commentType: 'comment', boardType, boardId, setCommentList }}
      />
      <hr />
      <main>
        {!!commentList.length && (
          <ul>
            {commentList.map((el: Comment) => (
              <li key={el.commentId}>
                <CommentListItem
                  {...{
                    ...el,
                    commentType: 'comment',
                    boardType,
                    isLoggedIn,
                    currentUserId,
                    setCommentList,
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
      <footer className="h-0.5" ref={sentinel} />
    </div>
  );
};

export default CommentList;
