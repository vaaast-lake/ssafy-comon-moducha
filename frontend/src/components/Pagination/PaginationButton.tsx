interface pageType {
  page: number;
  currentPage: number;
}
const PaginationButton = ({ page, currentPage }: pageType) => {
  return (
    <button
      className={`join-item btn ${page === currentPage ? 'btn-active' : ''}`}
    >
      {page}
    </button>
  );
};
export default PaginationButton;
