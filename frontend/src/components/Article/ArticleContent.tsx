import ArticleCarousel from '../../components/Article/ArticleCarousel';
import { ShareDetailItem } from '../../types/ShareType';
import { useEffect } from 'react';

const ArticleContent = ({
  title,
  content,
  nickname,
  createdDate,
  endDate,
  viewCount,
  participants,
  maxParticipants,
  children,
}: ShareDetailItem) => {
  useEffect(() => {});

  return (
    <div className="p-4 shadow border flex flex-col gap-4">
      <header className="border rounded p-4 shadow-md">
        <h1 className="text-2xl font-semibold text-wood truncate">{title}</h1>
      </header>
      <article>
        <ArticleCarousel />
        <p className="text-lg font-medium text-gray-800 my-4">{content}</p>
        <hr />
      </article>
      <section>{children}</section>
    </div>
  );
};

export default ArticleContent;
