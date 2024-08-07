import { useEffect, useRef, useState } from 'react';
import { Comment } from '../../types/CommentType';
import CommentListItem from './CommentListItem';
import { fetchCommentList } from '../../api/fetchComment';
import mockCommentList from '../../constants/shareCommentResponseTest.json';
import { BoardType } from '../../types/BoardType';
import CommentWrite from './CommentWrite';

interface Board {
  boardType: BoardType;
  boardId: number;
}

const CommentList = ({ boardType, boardId }: Board) => {
  const defaultParams = {
    boardType,
    boardId,
    page: 1,
    perPage: 10,
  };

  const [hasComments, setHasComments] = useState(true);
  const [commentList, setCommentList] = useState<Comment[]>(
    mockCommentList.data
  );
  const [fetchParams, setFetchParams] = useState(defaultParams);
  const sentinel = useRef(null);

  useEffect(() => {
    fetchCommentList(fetchParams)
      .then((res) => {
        setCommentList(res.data.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setHasComments(false);
        }
      });
  }, [fetchParams]);

  return (
    <div>
      <header>
        <h1 className="m-2 text-xl font-bold">댓글</h1>
        <hr className="border border-gray-300" />
      </header>
      <CommentWrite
        {...{ boardType, boardId, hasComments, setHasComments, setCommentList }}
      />
      <hr />
      <main>
        {hasComments && (
          <ul>
            {commentList.map((el: Comment) => (
              <CommentListItem
                key={el.commentId}
                boardType={boardType}
                commentItem={el}
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
