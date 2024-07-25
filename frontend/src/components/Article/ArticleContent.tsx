import TitleCard from '../Title/TitleCard';
import ArticleCarousel from '../../components/Article/ArticleCarousel';
import { ShareDetailItem } from '../../types/ShareType';

const ArticleContent = ({
  title,
  content,
  nickname,
  createdDate,
  endDate,
  viewCount,
  participants,
  maxParticipants,
}: ShareDetailItem) => {
  return (
    <main className="p-4 shadow border h-full flex flex-col gap-4">
      <header className="border rounded p-4 shadow-md">
        <h1 className='text-2xl font-semibold text-wood truncate'>{title}</h1>
      </header>
      <ArticleCarousel />
      <p className='text-lg font-medium text-gray-800 subpixel-antialiased'>{content}</p>
    </main>
  );
};

export default ArticleContent;
