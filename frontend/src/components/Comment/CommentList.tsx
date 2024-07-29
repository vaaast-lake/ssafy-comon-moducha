import { useEffect, useRef, useState } from 'react';
import { Comment } from '../../types/CommentType';
import CommentListItem from './CommentListItem';
import { fetchCommentList } from '../../api/fetchComment';
import mockCommentList from '../../constants/shareCommentResponseTest.json';

interface Board {
  boardType: 'shares' | 'teatimes';
  articleId: string;
}

const CommentList = ({ boardType, articleId }: Board) => {
  const FETCH_PARAMS = {
    boardType,
    articleId,
    page: 1,
    limit: 12,
  };

  const [commentList, setCommentList] = useState<Comment[]>(
    mockCommentList.data
  );
  const [fetchParams, setFetchParams] = useState(FETCH_PARAMS);
  const sentinel = useRef(null);

  useEffect(() => {
    fetchCommentList(fetchParams).then((res) => setCommentList(res.data));
  });

  return (
    <div>
      <header>
        <h1 className="m-2 text-xl font-bold">댓글</h1>
        <hr className="border border-gray-300" />
      </header>
      <main>
        <ul>
          {commentList.map((el: Comment) => (
            <CommentListItem key={el.commentId} {...el} />
          ))}
        </ul>
      </main>
      <footer className="h-0.5" ref={sentinel} />
    </div>
  );
};

export default CommentList;
