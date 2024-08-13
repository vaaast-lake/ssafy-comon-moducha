import React from 'react';
import TeatimeListToggle from '../../Home/componenets/TeatimeListToggle';
import { Link } from 'react-router-dom';
import TeatimeListCard from '../../Home/componenets/TeatimeListCard';
import { ChevronRightIcon } from '@heroicons/react/16/solid';
import useFetchMyTeatimeList from '../../../hooks/useFetchMyTeatimeList';
import { TeatimeListItem } from '../../../types/TeatimeType';
import { Dispatch, SetStateAction } from 'react';

const TeatimeList = (props: React.HTMLProps<HTMLElement>) => {
  interface TeatimeFetch {
    articleList: TeatimeListItem[];
    sort: string;
    setSort: Dispatch<SetStateAction<string>>;
    pageData: {
      page: number;
      totalPage: number;
      setPage: Dispatch<SetStateAction<number>>;
    };
    isLoading: boolean;
  }

  const {
    articleList: teatimeList,
    sort,
    setSort,
    pageData,
    isLoading,
  }: TeatimeFetch = useFetchMyTeatimeList('teatimes', 12);

  if (isLoading) {
    return <div>로딩 중...</div>; // 로딩 중일 때 표시할 컴포넌트
  }

  return (
    <>
      <section {...props}>
        <h1 className="font-semibold text-2xl">내가 작성한 티타임</h1>
        <section className="flex items-center justify-between">
          <div className="flex gap-2">
            <TeatimeListToggle sort={sort} setSort={setSort} />
          </div>
        </section>
        <article className="grid grid-cols-2 grid-rows-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {teatimeList.length > 0 ? (
            teatimeList.map((el) => (
              <TeatimeListCard key={el.boardId} {...el} />
            ))
          ) : (
            <div>등록된 티타임이 없습니다.</div>
          )}
        </article>
        <footer className="flex justify-center">
          <Link
            to={'teatimes'}
            className="flex justify-center items-center bg-[#F1F1F1] px-3 py-2 ps-4 rounded-full font-semibold"
          >
            <ChevronRightIcon className="size-5 text-[#A2A2A2]" />
          </Link>
        </footer>
      </section>
      <section>
        <h1 className="font-semibold text-2xl">내가 참여한 티타임</h1>
      </section>
    </>
  );
};

export default TeatimeList;
