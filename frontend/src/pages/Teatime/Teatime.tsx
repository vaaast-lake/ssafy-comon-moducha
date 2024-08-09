import TeatimeCard from './components/TeatimeCard';
import TeatimeHeader from './components/TeatimeHeader';
import TitleCard from '../../components/Title/TitleCard';
import Pagination from '../../components/Pagination/Pagination';
import { TeatimeListItem } from '../../types/TeatimeType';
import { fetchArticleList } from '../../api/fetchArticle';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SideLayout from '../../components/Layout/SideLayout';
import MainLayout from '../../components/Layout/MainLayout';
import ArticleNotFound from '../../components/Article/ArticleNotFound';

const Teatime = () => {
  const [teatimeList, setTeatimeList] = useState([]);
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
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
    <div className="grid grid-cols-10">
      {/* 좌측 사이드바 영역 */}
      <SideLayout></SideLayout>
      <MainLayout>
        <header>
          <TitleCard>
            <div className="flex justify-between items-center">
              <span className="text-disabled">티타임</span>
              <Link to={'write'} className="btn btn-sm text-wood bg-papaya">
                글쓰기
              </Link>
            </div>
          </TitleCard>
          <div className="divider"></div>
        </header>

        {/* 빈 배열일 경우 */}
        {!teatimeList.length ? (
          <ArticleNotFound />
        ) : (
          <>
            <div className="flex justify-between">
              <TeatimeHeader {...{ sort, setSort }} />
            </div>
            <section
              id="share-list"
              className="my-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3"
            >
              <TeatimeCardList teatimeItems={teatimeList} />
            </section>

            <footer className="flex justify-center">
              <Pagination {...{ page, totalPage, setPage }} />
            </footer>
          </>
        )}
      </MainLayout>
      {/* 우측 사이드바 영역 */}
      <SideLayout></SideLayout>
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
