import TeatimeCard from './components/TeatimeCard';
import TeatimeHeader from './components/TeatimeHeader';
import TitleCard from '../../components/Title/TitleCard';
import Pagination from '../../components/Pagination/Pagination';
import { TeatimeListItem } from '../../types/TeatimeType';
import { Link } from 'react-router-dom';
import SideLayout from '../../components/Layout/SideLayout';
import MainLayout from '../../components/Layout/MainLayout';
import useFetchList from '../../hooks/useFetchList';
import LoadWrapper from '../../components/Loading/LoadWrapper';

const Teatime = () => {
  const {
    articleList: teatimeList,
    sort,
    setSort,
    pageData,
    isLoading,
  } = useFetchList('teatimes');

  return (
    <div className="grid grid-cols-10">
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
        <LoadWrapper isLoading={isLoading} listLength={teatimeList.length}>
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
            <Pagination {...pageData} />
          </footer>
        </LoadWrapper>
      </MainLayout>
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
