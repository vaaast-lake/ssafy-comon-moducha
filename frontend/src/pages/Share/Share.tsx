import ShareCard from './components/ShareCard';
import ShareHeader from './components/ShareHeader';
import TitleCard from '../../components/Title/TitleCard';
import Pagination from '../../components/Pagination/Pagination';
import { shareResponse } from '../../constants/shareResponseTest';

import { ShareListItem } from '../../types/ShareType';
import { fetchShareList } from '../../api/fetchShare';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Share = () => {
  const [shareList, setShareList] = useState(shareResponse.data);
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const perPage = 12;

  useEffect(() => {
    fetchShareList(sort, page, perPage)
      .then((res) => {
        setShareList(res.data);
        setTotalPage(res.data.pagination.total);
      })
      .catch((err) => console.log(err));
  });

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
              <span className="text-disabled">나눔</span>
              <Link to={'write'} className="btn btn-sm text-wood bg-papaya">
                글쓰기
              </Link>
            </div>
          </TitleCard>
          <div className="divider"></div>
          <div className="flex justify-between">
            <ShareHeader {...{ sort, setSort }} />
          </div>
        </header>

        <section
          id="share-list"
          className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3"
        >
          <ShareCardList shareItems={shareList} />
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

export default Share;

const ShareCardList = ({ shareItems }: { shareItems: ShareListItem[] }) => {
  return shareItems.map((shareItem) => (
    <ShareCard key={shareItem.shareBoardId} {...shareItem} />
  ));
};
