import { Dispatch, SetStateAction, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { BoardType } from '../../types/BoardType';
import { Comment } from '../../types/CommentType';
import useAuthStore from '../../stores/authStore';

interface CommentWriteProp {
  boardType: BoardType;
  boardId: number;
  setCommentList: Dispatch<SetStateAction<Comment[]>>;
}

const CommentWrite = ({
  boardType,
  boardId,
  setCommentList,
}: CommentWriteProp) => {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { isLoggedIn, userId, nickname } = useAuthStore((state) => ({
    isLoggedIn: state.isLoggedIn,
    userId: state.currentUserId,
    nickname: state.currentUsername,
  }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSending(() => true);
    axiosInstance
      .post(`${boardType}/${boardId}/comments`, {
        content,
      })
      .then((res) => {
        // creationResponse에 현재 유저 정보 삽입
        setCommentList((prev) => [
          ...prev,
          {
            ...res.data.data,
            replyCount: 0,
            userId,
            nickname,
          },
        ]);
        clearForm();
      })
      .catch((err) => {
        alert('댓글 작성 중 에러가 발생했습니다.');
        return err;
      })
      .finally(() => {
        setIsSending(() => false);
      });
  };
  const clearForm = () => {
    setContent(() => '');
  };

  return (
    <form onSubmit={handleSubmit} className="flex py-4">
      <textarea
        className={`w-full border p-4 resize-none focus:outline-none focus:border-tea focus:ring-tea ${!isLoggedIn && 'bg-gray-100'}`}
        name="content"
        placeholder={
          isLoggedIn
            ? '댓글을 작성해 보세요'
            : '댓글을 작성하려면 로그인 하세요'
        }
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        disabled={!isLoggedIn}
      />
      <div className="w-24 flex flex-col px-2 gap-2">
        <button
          type="submit"
          className="btn rounded bg-teabg text-tea hover:bg-tea hover:text-white"
          disabled={isSending || !isLoggedIn}
        >
          작성
        </button>
        <button
          onClick={clearForm}
          type="button"
          className="btn rounded bg-teabg text-tea hover:bg-tea hover:text-white"
          disabled={isSending || !isLoggedIn}
        >
          삭제
        </button>
      </div>
    </form>
  );
};

export default CommentWrite;
