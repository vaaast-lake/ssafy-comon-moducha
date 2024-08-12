import TeatimeListToggle from './TeatimeListToggle';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TeatimeListCard from './TeatimeListCard';
import { ChevronRightIcon } from '@heroicons/react/16/solid';
import { TeatimeListItem } from '../../../types/TeatimeType';
import { fetchArticleList } from '../../../api/fetchArticle';

const TeatimeList = ({ ...props }) => {
  const [teatimeList, setTeatimeList] = useState<TeatimeListItem[]>([]);
  const [currentTab, setCurrentTab] = useState('latest');
  useEffect(() => {
    fetchArticleList({
      boardType: 'teatimes',
      sort: currentTab,
      page: 1,
      perPage: 8,
    }).then((res) => {
      setTeatimeList(res.data.data);
    });
  }, [currentTab]);
  return (
    <section {...props}>
      <h1 className="font-semibold text-2xl">티타임 목록</h1>
      <section className="flex items-center justify-between">
        <div className="flex gap-2">
          <TeatimeListToggle {...{ currentTab, setCurrentTab }} />
        </div>
        <Link to={'teatimes/write'} className="text-tea">
          + 모집하기
        </Link>
      </section>
      <article className="grid grid-cols-2 grid-rows-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {teatimeList.map((el, index) => (
          <TeatimeListCard key={el.boardId} {...{ ...el, index }} />
        ))}
      </article>
      <footer className="flex justify-center">
        <Link
          to={'teatimes'}
          className="flex justify-center items-center bg-[#F1F1F1] px-3 py-2 ps-4 rounded-full font-semibold"
        >
          <span className="text-gray-600 text-sm">더보기</span>
          <ChevronRightIcon className="size-5 text-[#A2A2A2]" />
        </Link>
      </footer>
    </section>
  );
};

export default TeatimeList;
