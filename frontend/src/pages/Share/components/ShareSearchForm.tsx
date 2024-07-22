import { CiSearch } from 'react-icons/ci';

const ShareSearchForm = () => {
  return (
    <div className="join mt-3">
      <input className="input input-bordered join-item" placeholder="검색" />
      <select className="select select-bordered join-item">
        <option value="title">제목</option>
        <option value="content">내용</option>
        <option value="author">작성자</option>
      </select>
      <div className="indicator">
        <button className="btn join-item">
          <CiSearch size={36} />
        </button>
      </div>
    </div>
  );
};

export default ShareSearchForm;
