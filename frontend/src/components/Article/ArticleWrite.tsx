import TextEditor from '../../utils/TextEditor/TextEditor';
import { CameraIcon } from '@heroicons/react/24/outline';

const ArticleWrite = () => {
  const testImageList = [];
  for (let i = 0; i < 10; i++) {
    testImageList.push({
      id: i,
      url: `https://picsum.photos/id/${10 + i}/1600/900`,
    });
  }
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };
  return (
    <form method="post" onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button className="btn bg-cornsilk hover:bg-wood size-28 overflow-clip p-2 flex flex-col">
          <CameraIcon className="size-8" />
          <span className="text-xs">0/10</span>
        </button>
        {/* 업로드 이미지 순회하며 버튼 생성 */}
        <div className="flex w-full gap-2 overflow-x-scroll">
          {testImageList.map((el) => (
            <button
              key={el.id}
              className="btn bg-cornsilk hover:bg-wood size-28 overflow-clip p-0 flex flex-col"
            >
              <img src={el.url} alt="" />
            </button>
          ))}
        </div>
      </div>
      <header className="flex items-center justify-between">
        <input
          className="input input-bordered w-full mr-4 md:w-1/2 md:mr-0"
          type="text"
          placeholder="제목을 입력하세요"
        />
        <input
          className="btn text-wood bg-papaya hover:bg-wood"
          type="submit"
          value="작성하기"
        />
      </header>
      <TextEditor />
    </form>
  );
};

export default ArticleWrite;
