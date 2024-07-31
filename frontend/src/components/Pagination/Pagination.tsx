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
        className={`join-item btn ${i === page ? 'btn-active' : ''}`}
        onClick={() => setPage(i)}
      >
        {i}
      </button>
    );
  }
  return <div className="join">{pageButtonArray}</div>;
};

export default Pagination;
