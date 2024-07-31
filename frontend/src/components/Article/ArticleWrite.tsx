import { useEffect, useState } from 'react';
import TextEditor from '../../utils/TextEditor/TextEditor';
import testImageList from '../../constants/uploadImageTest';
import ArticleImageUpload from './ArticleImageUpload';
import { ImageList } from '../../types/ArticleType';
import axiosInstance from '../../api/axiosInstance';
import dayjs from 'dayjs';

const dayJsNow = (time?: string) => dayjs(time).format('YYYY-MM-DDTHH:mm');

const ArticleWrite = () => {
  const [pickedDate, setPickedDate] = useState('');
  const [imageList, setImageList] = useState<ImageList>(testImageList());
  const [content, setContent] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    event.preventDefault();
    const inputData = {
      title: formData.get('title'),
      endDate: formData.get('endDate') + 'Z',
      maxParticipants: formData.get('maxParticipants'),
      content,
    };
    axiosInstance
      .post('/shares', inputData)
      .then((res) => {})
      .catch();
    console.log(inputData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
      <ArticleImageUpload imageList={imageList} />
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
      <TextEditor setInput={setContent} />
    </form>
  );
};

export default ArticleWrite;
