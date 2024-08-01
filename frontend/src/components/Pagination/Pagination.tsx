import { Dispatch, SetStateAction } from 'react';

interface Page {
  page: number;
  totalPage: number;
  setPage: Dispatch<SetStateAction<number>>;
}

const Pagination = ({ page, totalPage, setPage }: Page) => {
  const pageButtonArray = [];
  for (let i = 1; i <= totalPage; i++) {
    pageButtonArray.push(
      <button
        key={i}
        className={`join-item btn rounded-2xl hover:bg-[#ccd5ae] border-none font-bold text-white ${i === page ? 'bg-[#ccd5ae]' : 'bg-[#e9edc9]'}`}
        onClick={() => setPage(i)}
      >
        {i}
      </button>
    );
  }
  return <div className="join">{pageButtonArray}</div>;
};

export default Pagination;
