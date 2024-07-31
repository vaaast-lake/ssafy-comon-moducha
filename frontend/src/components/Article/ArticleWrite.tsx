import { useState } from 'react';
import TextEditor from '../../utils/TextEditor/TextEditor';
import testImageList from '../../constants/uploadImageTest';
import ArticleImageUpload from './ArticleImageUpload';
import { ImageList } from '../../types/ArticleImageType';

const ArticleWrite = () => {
  const [imageList, setImageList] = useState<ImageList>(testImageList());
  const [inputData, setInputData] = useState('');
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <ArticleImageUpload imageList={imageList} />
      <header className="flex items-center justify-between">
        <input
          className="input input-bordered w-full mr-4 md:w-1/2 md:mr-0"
          type="text"
          placeholder="제목을 입력하세요"
        />
        <input
          className="btn text-wood bg-papaya hover:bg-wood hover:text-white"
          type="submit"
          value="작성하기"
        />
      </header>
      <TextEditor setInput={setInputData} />
    </form>
  );
};

export default ArticleWrite;
