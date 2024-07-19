import PaginationButton from './PaginationButton';

interface pageType {
  limit: number;
  currentPage: number;
}

const Pagination = ({ limit, currentPage }: pageType) => {
  const pageButtonArray = [];
  for (let page = 1; page < limit + 1; page++) {
    pageButtonArray.push(
      <PaginationButton
        page={page}
        currentPage={currentPage}
        key={'page' + page}
      />
    );
  }
  return <div className="join">{pageButtonArray}</div>;
};

export default Pagination;
