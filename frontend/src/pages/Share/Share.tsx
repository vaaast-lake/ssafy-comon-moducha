import ShareCard from './components/ShareCard';
import ShareHeader from './components/ShareHeader';
import TitleCard from '../../components/Title/TitleCard';
import Pagination from '../../components/Pagination/Pagination';
import shareResponse from '../../constants/shareResponseTest';

import { useShareStore } from '../../stores/shareStore';
import { ShareListItem } from '../../types/ShareType';
import { fetchShareList } from '../../api/fetchShare';
import { useEffect, useState } from 'react';

const Share = () => {
  const { shareList, setShareList } = useShareStore();
  const [sortOption, setSortOption] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const perPage = 12;

  useEffect(() => {
    fetchShareList(sortOption, currentPage, perPage)
      .then((res) => {
        setShareList(res.data);
        setTotalPage(res.data.pagination.total)
      })
      .catch((err) => console.log(err));
    setShareList(shareResponse);
  }, [currentPage, setShareList, sortOption]);

  return (
    <div className="flex justify-center m-5">
      {/* 좌측 사이드바 영역 */}
      <aside className="lg:w-1/5"></aside>

      <main id="share-body" className="lg:w-3/5 flex flex-col gap-4">
        <header>
          <TitleCard title="나눔" />
          <div className="divider"></div>
          <div className="flex justify-between">
            <ShareHeader {...{ sortOption, setSortOption }} />
          </div>
        </header>

        <section
          id="share-list"
          className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3"
        >
          <ShareCardList shareItems={shareList} />
        </section>

        <footer className="flex justify-center">
          <Pagination {...{ currentPage, totalPage, setCurrentPage }} />
        </footer>
      </main>
      {/* 우측 사이드바 영역 */}
      <aside className="lg:w-1/5"></aside>
    </div>
  );
};

export default Share;

const ShareCardList = ({ shareItems }: { shareItems: ShareListItem[] }) => {
  return shareItems.map((shareItem) => (
    <ShareCard key={shareItem.shareBoardId} {...shareItem} />
  ));
};
