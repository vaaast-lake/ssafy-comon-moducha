import TeatimeCard from './components/TeatimeCard';
import TeatimeHeader from './components/TeatimeHeader';
import TitleCard from '../../components/Title/TitleCard';
import Pagination from '../../components/Pagination/Pagination';
import { mockList } from '../../constants/teatimeMock';

import { TeatimeListItem } from '../../types/TeatimeType';
import { fetchArticleList } from '../../api/fetchArticle';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const Teatime = () => {
  const [teatimeList, setTeatimeList] = useState(mockList.data);
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const { isLoggedIn } = useAuthStore();
  const perPage = 12;

  useEffect(() => {
    fetchArticleList({ boardType: 'teatimes', sort, page, perPage })
      .then((res) => {
        setTeatimeList(res.data.data);
        setTotalPage(res.data.pagination.total);
        setPage(res.data.pagination.page);
      })
      .catch((err) => console.log(err));
  }, [sort, page]);

  return (
    <div className="grid grid-cols-12">
      {/* 좌측 사이드바 영역 */}
      <aside className="hidden lg:flex col-span-2"></aside>
      <main
        id="share-body"
        className="col-span-12 m-5 lg:col-span-8 flex flex-col gap-4"
      >
        <header>
          <TitleCard>
            <div className="flex justify-between items-center">
              <span className="text-disabled">티타임</span>
              {isLoggedIn && (
                <Link to={'write'} className="btn btn-sm text-wood bg-papaya">
                  글쓰기
                </Link>
              )}
            </div>
          </TitleCard>
          <div className="divider"></div>
          <div className="flex justify-between">
            <TeatimeHeader {...{ sort, setSort }} />
          </div>
        </header>

        <section
          id="share-list"
          className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3"
        >
          <TeatimeCardList teatimeItems={teatimeList} />
        </section>

        <footer className="flex justify-center">
          <Pagination {...{ page, totalPage, setPage }} />
        </footer>
      </main>
      {/* 우측 사이드바 영역 */}
      <aside className="hidden lg:flex col-span-2"></aside>
    </div>
  );
};

export default Teatime;

const TeatimeCardList = ({
  teatimeItems,
}: {
  teatimeItems: TeatimeListItem[];
}) => {
  return teatimeItems.map((shareItem) => (
    <TeatimeCard key={shareItem.boardId} {...shareItem} />
  ));
};
