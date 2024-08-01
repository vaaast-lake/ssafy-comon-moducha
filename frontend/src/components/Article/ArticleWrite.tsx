import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextEditor from '../../utils/TextEditor/TextEditor';
import testImageList from '../../constants/uploadImageTest';
import ArticleImageUpload from './ArticleImageUpload';
import { ImageList } from '../../types/ArticleType';
import axiosInstance from '../../api/axiosInstance';
import dayjs from 'dayjs';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const dayJsNow = (time?: string) => dayjs(time).format('YYYY-MM-DDTHH:mm');

const ArticleWrite = ({ boardType }: { boardType: string }) => {
  const [pickedDate, setPickedDate] = useState<string>(dayJsNow());
  const [imageList, setImageList] = useState<ImageList>(testImageList());
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (content === '') {
      setError('본문을 입력해 주세요.');
      return;
    }
    const formData = new FormData(event.currentTarget);
    const inputData = {
      title: formData.get('title') as string,
      endDate: (formData.get('endDate') as string) + 'Z',
      maxParticipants: formData.get('maxParticipants') as string,
      content,
    };

    try {
      const response = await axiosInstance.post(`/${boardType}`, inputData);
      const boardId = response.data.data.boardId;
      navigate(`/${boardType}/${boardId}`);
    } catch (error) {
      setError('글 작성에 실패하였습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <Error error={error} />}
      <Header />
      <ArticleImageUpload imageList={imageList} />
      <DateInput pickedDate={pickedDate} setPickedDate={setPickedDate} />
      <ParticipantsInput />
      <TextEditor setInput={setContent} />
    </form>
  );
};

const Error = ({ error }: { error: string }) => (
  <div role="alert" className="alert bg-warning shadow text-white flex">
    <ExclamationTriangleIcon className="size-8" />
    <span className="font-bold">{error}</span>
  </div>
);

const Header = () => (
  <header className="flex items-center justify-between gap-2">
    <label className="input input-bordered w-full md:w-1/2 items-center flex gap-2">
      <span className="pr-2 border-r-2">제목</span>
      <input
        className="grow w-4"
        type="text"
        placeholder="제목을 입력하세요"
        name="title"
        required
      />
    </label>
    <input
      className="btn text-wood bg-papaya hover:bg-wood hover:text-white"
      type="submit"
      value="작성하기"
    />
  </header>
);

type DateInputProps = {
  pickedDate: string;
  setPickedDate: (date: string) => void;
};

const DateInput = ({ pickedDate, setPickedDate }: DateInputProps) => (
  <label className="input input-bordered w-full md:w-1/2 flex items-center gap-2">
    <span className="pr-2 border-r-2">마감</span>
    <input
      className="grow w-4"
      type="datetime-local"
      name="endDate"
      value={pickedDate}
      onChange={(e) => setPickedDate(e.target.value)}
      min={dayJsNow()}
      step={1}
      required
    />
  </label>
);

const ParticipantsInput = () => (
  <label className="input input-bordered w-full md:w-1/2 flex items-center gap-2">
    <span className="pr-2 border-r-2">인원</span>
    <input
      className="grow w-4"
      type="number"
      name="maxParticipants"
      min={1}
      required
    />
  </label>
);

export default ArticleWrite;
