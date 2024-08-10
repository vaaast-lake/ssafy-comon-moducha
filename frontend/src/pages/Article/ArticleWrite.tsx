import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextEditor from '../../utils/TextEditor/TextEditor';
import axiosInstance from '../../api/axiosInstance';
import { BoardType } from '../../types/BoardType';
import useAuthStore from '../../stores/authStore';
import InputTitle from '../../components/Form/InputTitle';
import InputDate from '../../components/Form/InputDate';
import dayJsNow from '../../utils/dayJsNow';
import InputBroadcastDate from '../../components/Form/InputBroadcastDate';
import InputParticipants from '../../components/Form/InputParticipants';
import InputError from '../../components/Form/InputError';
import dayjs from 'dayjs';

const ArticleWrite = ({ boardType }: { boardType: BoardType }) => {
  const [pickedDate, setPickedDate] = useState<string>(
    dayJsNow(dayjs().add(1, 'day').toString())
  );
  const [broadcastDate, setBroadcastDate] = useState<string>(
    dayJsNow(dayjs().add(1, 'day').toString())
  );
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const images = useRef<Array<string>>([]);
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    // 비로그인 상태인 경우 로그인 페이지로 리디렉션
    if (!isLoggedIn) {
      navigate('/login');
    }
  });
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (content === '') {
      setError('본문을 입력해 주세요.');
      return;
    }
    const formData = new FormData(event.currentTarget);
    const inputData = {
      title: formData.get('title'),
      endDate: formData.get('endDate') + 'Z',
      maxParticipants: formData.get('maxParticipants'),
      ...(boardType === 'teatimes' && {
        broadcastDate: formData.get('broadcastDate') + 'Z',
      }),
      content,
      images: images.current,
    };

    try {
      const response = await axiosInstance.post(`/${boardType}`, inputData);
      const boardId = response.data.data.boardId;
      navigate(`/${boardType}/${boardId}`);
    } catch (error) {
      setError('글 작성에 실패하였습니다. 잠시 후 다시 시도해 주세요.');
    }
  };
  // 비로그인 상태인 경우 useEffect 훅 이전에 표시되지 않도록 null 리턴
  if (!isLoggedIn) return null;
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <InputError error={error} />}
      <InputTitle />
      <InputDate pickedDate={pickedDate} setPickedDate={setPickedDate} />
      {boardType === 'teatimes' && (
        <InputBroadcastDate
          broadcastDate={broadcastDate}
          setBroadcastDate={setBroadcastDate}
        />
      )}
      <InputParticipants />
      <TextEditor images={images} setInput={setContent} />
    </form>
  );
};

export default ArticleWrite;
