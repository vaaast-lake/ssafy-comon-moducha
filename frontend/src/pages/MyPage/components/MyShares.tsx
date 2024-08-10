//MyShares.tsx
import { useState, useEffect } from 'react';
import getMyShareWriteList from '../api/getMyShareWriteList';
import getMySharesParticipateList from '../api/getMyShareParticipateList';

const MyShares = () => {
  const [writeList, setWriteList] = useState<any[]>([]);
  const [participatedList, setParticipatedList] = useState<any[]>([]);
  const [writePage, setWritePage] = useState<number>(1);
  const [participatedPage, setParticipatedPage] = useState<number>(1);
  const [writePerPage] = useState<number>(12);
  const [participatedPerPage] = useState<number>(12);
  const [writeTotal, setWriteTotal] = useState<number>(0);
  const [participatedTotal, setParticipatedTotal] = useState<number>(0);
  const [writeSort, setWriteSort] = useState<'before' | 'ongoing'>('before');
  const [participatedSort, setParticipatedSort] = useState<
    'before' | 'ongoing'
  >('before');

  useEffect(() => {
    fetchMyShareWriteList();
    fetchMySharesParticipateList();
  }, [writePage, participatedPage, writeSort, participatedSort]);

  const fetchMyShareWriteList = async () => {
    try {
      const { data } = await getMyShareWriteList({
        page: writePage,
        perPage: writePerPage,
      });

      // 데이터 구조를 맞추어 수정합니다.
      const items = data.data || []; // data 배열
      const pagination = data.pagination || { total: 0 }; // pagination 객체

      setWriteList(items);
      setWriteTotal(pagination.total);
    } catch (error) {
      console.error('나의 나눔 작성 목록을 가져오는 데 실패했습니다:', error);
    }
  };

  const fetchMySharesParticipateList = async () => {
    try {
      const { data } = await getMySharesParticipateList({
        sort: participatedSort,
        page: participatedPage,
        perPage: participatedPerPage,
      });

      // 데이터 구조를 맞추어 수정합니다.
      const items = data.data || []; // data 배열
      const pagination = data.pagination || { total: 0 }; // pagination 객체

      setParticipatedList(items);
      setParticipatedTotal(pagination.total);
    } catch (error) {
      console.error(
        '내가 참여 신청한 나눔 목록을 가져오는 데 실패했습니다:',
        error
      );
    }
  };

  const handleWriteSortChange = (sort: 'before' | 'ongoing') => {
    setWriteSort(sort);
    setWritePage(1); // 상태 변경 시 페이지를 1로 리셋
  };

  const handleParticipatedSortChange = (sort: 'before' | 'ongoing') => {
    setParticipatedSort(sort);
    setParticipatedPage(1); // 상태 변경 시 페이지를 1로 리셋
  };

  return (
    <div>
      <h1 className="font-semibold text-2xl">나의 나눔</h1>
      <div>
        <h3 className="font-semibold">내가 작성한 나눔 목록</h3>
        <div>
          <button onClick={() => handleWriteSortChange('before')}>
            전체(버튼)
          </button>
          <button onClick={() => handleWriteSortChange('ongoing')}>
            진행 중(버튼)
          </button>
        </div>
        <ul>
          {writeList.length > 0 ? (
            writeList.map((item) => (
              <li key={item.boardId}>
                <h3>{item.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: item.content }} />
                <p>작성자: {item.nickname}</p>
                <p>마감일: {new Date(item.endDate).toLocaleDateString()}</p>
              </li>
            ))
          ) : (
            <li>작성한 나눔이 없습니다.</li>
          )}
        </ul>
        <div>
          <button
            onClick={() => setWritePage((prev) => Math.max(prev - 1, 1))}
            disabled={writePage === 1}
          >
            Previous(버튼)
          </button>
          <span>
            Page {writePage} of {Math.ceil(writeTotal / writePerPage)}
          </span>
          <button
            onClick={() => setWritePage((prev) => prev + 1)}
            disabled={writePage >= Math.ceil(writeTotal / writePerPage)}
          >
            Next(버튼)
          </button>
        </div>

        <div>
          <h3 className="font-semibold">내가 참여 신청한 나눔 목록</h3>
          <div>
            <button onClick={() => handleParticipatedSortChange('before')}>
              전체(버튼)
            </button>
            <button onClick={() => handleParticipatedSortChange('ongoing')}>
              진행 중(버튼)
            </button>
          </div>
          <ul>
            {participatedList.length > 0 ? (
              participatedList.map((item) => (
                <li key={item.boardId}>
                  <h3>{item.title}</h3>
                  <p dangerouslySetInnerHTML={{ __html: item.content }} />
                  <p>작성자: {item.nickname}</p>
                  <p>마감일: {new Date(item.endDate).toLocaleDateString()}</p>
                </li>
              ))
            ) : (
              <li>참여한 나눔이 없습니다.</li>
            )}
          </ul>
          <div>
            <button
              onClick={() =>
                setParticipatedPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={participatedPage === 1}
            >
              Previous(버튼)
            </button>
            <span>
              Page {participatedPage} of{' '}
              {Math.ceil(participatedTotal / participatedPerPage)}
            </span>
            <button
              onClick={() => setParticipatedPage((prev) => prev + 1)}
              disabled={
                participatedPage >=
                Math.ceil(participatedTotal / participatedPerPage)
              }
            >
              Next(버튼)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyShares;
