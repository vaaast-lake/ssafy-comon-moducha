type PageType = {
  page: Number;
  currentPage: Number;
};


const PaginationButton = ({ page, currentPage }: PageType) => {
  
  return (
    <button
      className={`join-item btn ${page === currentPage ? 'btn-active' : ''}`}
    >
      1
    </button>
  );
};

const Pagination = () => {
  return <div className="join">{PaginationButton}</div>;
};

export default Pagination;
