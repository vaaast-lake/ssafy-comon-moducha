import { Dispatch, SetStateAction } from 'react';

export interface Page {
  currentPage: number;
  totalPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const Pagination = ({ currentPage, totalPage, setCurrentPage }: Page) => {
  const pageButtonArray = [];
  for (let page = 1; page <= totalPage; page++) {
    pageButtonArray.push(
      <button
        key={page}
        className={`join-item btn ${page === currentPage ? 'btn-active' : ''}`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    );
  }
  return <div className="join">{pageButtonArray}</div>;
};

export default Pagination;
