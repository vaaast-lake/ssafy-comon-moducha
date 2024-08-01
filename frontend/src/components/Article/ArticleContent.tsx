import ArticleCarousel from '../../components/Article/ArticleCarousel';
import { ShareDetailItem } from '../../types/ShareType';
import { useEffect } from 'react';

interface ArticleProp extends ShareDetailItem {
  children: React.ReactNode;
}
const ArticleContent = ({ title, content, children }: ArticleProp) => {
  useEffect(() => {});
  const testImageList = [
    { url: 'https://picsum.photos/id/10/1600/900' },
    { url: 'https://picsum.photos/id/11/1600/900' },
    { url: 'https://picsum.photos/id/12/1600/900' },
    { url: 'https://picsum.photos/id/13/1600/900' },
    { url: 'https://picsum.photos/id/14/1600/900' },
    { url: 'https://picsum.photos/id/15/1600/900' },
  ];
  return (
    <div className="p-4 shadow border flex flex-col gap-4">
      <header className="border rounded p-4 shadow-md">
        <h1 className="text-2xl font-semibold text-wood truncate">{title}</h1>
      </header>
      <article>
        <ArticleCarousel banners={testImageList} />
        <p
          dangerouslySetInnerHTML={{ __html: content }}
          className="text-lg font-medium text-gray-800 my-4"
        ></p>
        <hr />
      </article>
      <section>{children}</section>
    </div>
  );
};

export default ArticleContent;
