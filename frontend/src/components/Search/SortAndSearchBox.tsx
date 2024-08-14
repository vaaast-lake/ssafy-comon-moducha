import { useState } from 'react';
import { CiSearch } from 'react-icons/ci';

const SearchBox = ({ className }: { className: string }) => {
  const [searchInput, setSearchInput] = useState('');
  const handleSearchInput = (searchValue: string): void => {
    setSearchInput(searchValue);
  };
  return (
    <div className={className}>
      <input
        className="input input-bordered w-full join-item"
        placeholder="검색"
      />
      <select className="select select-bordered join-item">
        <option value="title">제목</option>
        <option value="content">내용</option>
        <option value="author">작성자</option>
      </select>
      <div className="indicator">
        <button className="btn join-item bg-tea text-white hover:bg-emerald-600 rounded-xl">
          <CiSearch size={36} />
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
