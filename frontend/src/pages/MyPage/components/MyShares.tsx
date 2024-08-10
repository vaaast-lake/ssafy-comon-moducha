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
  const [writeStatus, setWriteStatus] = useState<'before' | 'ongoing'>(
    'before'
  );
  const [participatedStatus, setParticipatedStatus] = useState<
    'before' | 'ongoing'
  >('before');

  useEffect(() => {
    fetchMyShareWriteList();
    fetchMySharesParticipateList();
  }, [writePage, participatedPage, writeStatus, participatedStatus]);

  const fetchMyShareWriteList = async () => {
    try {
      const { data } = await getMyShareWriteList({
        page: writePage,
        perPage: writePerPage,
      });
      setWriteList(data.items);
      setWriteTotal(data.pagination.total);
    } catch (error) {
      console.error('Failed to fetch my share write list:', error);
    }
  };

  const fetchMySharesParticipateList = async () => {
    try {
      const { data } = await getMySharesParticipateList({
        status: participatedStatus,
        page: participatedPage,
        perPage: participatedPerPage,
      });
      setParticipatedList(data.items);
      setParticipatedTotal(data.pagination.total);
    } catch (error) {
      console.error('Failed to fetch my shares participate list:', error);
    }
  };

  const handleWriteStatusChange = (status: 'before' | 'ongoing') => {
    setWriteStatus(status);
    setWritePage(1); // 상태 변경 시 페이지를 1로 리셋
  };

  const handleParticipatedStatusChange = (status: 'before' | 'ongoing') => {
    setParticipatedStatus(status);
    setParticipatedPage(1); // 상태 변경 시 페이지를 1로 리셋
  };

  return (
    <div>
      <h1 className="font-semibold text-2xl">나의 나눔</h1>
      <div>
        <h3 className="font-semibold">내가 작성한 나눔 목록</h3>
        <div>
          <button onClick={() => handleWriteStatusChange('before')}>
            전체(버튼)
          </button>
          <button onClick={() => handleWriteStatusChange('ongoing')}>
            진행 중(버튼)
          </button>
        </div>
        <ul>
          {writeList.map((item) => (
            <li key={item.shareBoardId}>
              <h3>{item.title}</h3>
              <p>{item.content}</p>
              <p>작성자: {item.nickname}</p>
              <p>마감일: {new Date(item.endDate).toLocaleDateString()}</p>
            </li>
          ))}
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
      </div>

      <div>
        <h3 className="font-semibold">내가 참여 신청한 나눔 목록</h3>
        <div>
          <button onClick={() => handleParticipatedStatusChange('before')}>
            전체(버튼)
          </button>
          <button onClick={() => handleParticipatedStatusChange('ongoing')}>
            진행 중(버튼)
          </button>
        </div>
        <ul>
          {participatedList.map((item) => (
            <li key={item.shareBoardId}>
              <h3>{item.title}</h3>
              <p>{item.content}</p>
              <p>작성자: {item.nickname}</p>
              <p>마감일: {new Date(item.endDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
        <div>
          <button
            onClick={() => setParticipatedPage((prev) => Math.max(prev - 1, 1))}
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
  );
};

export default MyShares;
