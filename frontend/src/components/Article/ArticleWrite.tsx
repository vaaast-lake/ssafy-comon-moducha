import { useState } from 'react';
import TextEditor from '../../utils/TextEditor/TextEditor';
import testImageList from '../../constants/uploadImageTest';
import ArticleImageUpload from './ArticleImageUpload';
import { ImageList } from '../../types/ArticleType';
import axiosInstance from '../../api/axiosInstance';
import { ArticlePost } from '../../types/ArticleType';
import dayjs from 'dayjs';

const ArticleWrite = () => {
  const [currentDate, setCurrentDate] = useState(
    dayjs().format('YYYY-MM-DDTHH:mm:ss')
  );
  const [imageList, setImageList] = useState<ImageList>(testImageList());
  const [content, setContent] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    event.preventDefault();
    const inputData = {
      title: formData.get('articleTitle'),
      endDate: formData.get('endDate'),
      content,
    };
    axiosInstance.post('/shares', inputData);
    console.log(inputData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <ArticleImageUpload imageList={imageList} />
      <header className="flex items-center justify-between gap-2">
        <input
          className="input input-bordered w-full md:w-1/2"
          type="text"
          placeholder="제목을 입력하세요"
          name="articleTitle"
          required
        />
        <input
          type="datetime-local"
          className="input input-bordered"
          name="endDate"
          value={currentDate}
          onChange={() => setCurrentDate(dayjs().format('YYYY-MM-DDTHH:mm:ss'))}
          min={currentDate}
        />
        <input
          className="btn text-wood bg-papaya hover:bg-wood hover:text-white"
          type="submit"
          value="작성하기"
        />
      </header>
      <TextEditor setInput={setContent} />
    </form>
  );
};

export default ArticleWrite;
