import { Comment } from '../../types/CommentType';
import { BoardType } from '../../types/BoardType';
import avatarUrl from '../../assets/avatar/test_avatar.png';
import dateParser from '../../utils/dateParser';
import CommentReply from './CommentReply';
import axiosInstance from '../../api/axiosInstance';
import { Dispatch, SetStateAction } from 'react';

interface CommentListType extends Comment {
  boardType: BoardType;
  currentUserId: string;
  type: 'comment' | 'reply';
  setCommentList: Dispatch<SetStateAction<Comment[]>>;
}

const CommentListItem = ({
  type,
  boardType,
  nickname,
  content,
  createdDate,
  boardId,
  commentId,
  replyId,
  replyCount,
  userId,
  currentUserId,
  setCommentList,
}: CommentListType) => {
  const handleDelete = () => {
    if (type === 'comment') {
      axiosInstance
        .patch(`/${boardType}/${boardId}/deactivated-comments/${commentId}`)
        .then(() => {
          setCommentList((prev) =>
            // 댓글 삭제가 서버에서 성공하면 댓글 배열 순회하며 업데이트
            prev.map((el) => {
              if (el.commentId === commentId) {
                el.nickname = '';
                el.content = '삭제된 댓글입니다.';
              }
              return el;
            })
          );
        });
    } else if (type === 'reply') {
      axiosInstance.patch(
        `${boardType}/${boardId}/comments/${commentId}/deactivated-replies/${replyId}`
      );
    }
  };

  return (
    <li>
      <div className="flex py-4">
        <figure id="cmt-thumb" className="w-1/12">
          <img src={avatarUrl} alt="" />
        </figure>
        <main className="w-11/12 px-2 flex flex-col justify-between">
          <header className="flex justify-between">
            <span className="font-bold">{nickname}</span>
          </header>
          <article>
            <p className="pe-4">{content}</p>
          </article>
          <footer className="mt-2 text-sm text-gray-500 font-light flex gap-2">
            <span>{dateParser(createdDate)}</span>
            <div className="flex gap-1">
              {boardId && (
                <button className="font-medium text-gray-600">답글</button>
              )}
              {userId === currentUserId && nickname && (
                <>
                  ·
                  <button
                    onClick={handleDelete}
                    className="font-medium text-gray-600"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </footer>
        </main>
      </div>
      {!!replyCount && (
        <CommentReply
          {...{
            type: 'reply',
            boardType,
            boardId,
            commentId,
            replyCount,
            currentUserId,
          }}
        />
      )}
      {!!boardId && <hr />}
    </li>
  );
};

export default CommentListItem;
