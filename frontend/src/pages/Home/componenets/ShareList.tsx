import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ShareListCard from './ShareListCard';
import { fetchArticleList } from '../../../api/fetchArticle';
import { ShareListItem } from '../../../types/ShareType';
const ShareList = ({ ...props }) => {
  const [shareList, setShareList] = useState<ShareListItem[]>([]);
  useEffect(() => {
    fetchArticleList({
      boardType: 'shares',
      sort: 'latest',
      page: 1,
      perPage: 4,
    }).then((res) => {
      setShareList(res.data.data);
    });
  }, []);
  return (
    <section {...props}>
      <header className="flex justify-between items-center">
        <h1 className="font-semibold text-2xl">나눔 목록</h1>
        <Link to={'shares'} className="text-disabled">
          모두보기
        </Link>
      </header>
      <article className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {shareList.map((el) => (
          <ShareListCard key={el.boardId} {...el} />
        ))}
      </article>
    </section>
  );
};

export default ShareList;
