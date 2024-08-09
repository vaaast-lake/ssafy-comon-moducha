import { useState, useEffect } from 'react';
import getMyTeatimeWriteList from '../api/getMyTeatimeWriteList'; // API 호출 함수 import
import getMyTeatimeParticipateList from '../api/getMyTeatimeParticipateList'; // API 호출 함수 import

const Teatimes = () => {
  const [writeList, setWriteList] = useState<any[]>([]); // 사용자 작성 티타임 목록
  const [participateList, setParticipateList] = useState<any[]>([]); // 사용자 참여 티타임 목록
  const [writePagination, setWritePagination] = useState<any>({
    total: 0,
    page: 1,
    perPage: 12,
  });
  const [participatePagination, setParticipatePagination] = useState<any>({
    total: 0,
    page: 1,
    perPage: 12,
  });
  const [status, setStatus] = useState<'before' | 'ongoing'>('before'); // 티타임 상태 필터
  const [writeError, setWriteError] = useState<string | null>(null); // 작성 티타임 오류
  const [participateError, setParticipateError] = useState<string | null>(null); // 참여 티타임 오류

  // 티타임 작성 목록 조회
  const fetchMyTeatimeWriteList = async () => {
    try {
      const response = await getMyTeatimeWriteList({
        page: writePagination.page,
        perPage: writePagination.perPage,
      });
      setWriteList(response.data.items);
      setWritePagination(response.data.pagination);
      setWriteError(null); // 성공 시 오류 초기화
    } catch (error) {
      console.error('Error fetching my teatime write list:', error);
      setWriteError('작성한 티타임 목록을 가져오는 데 문제가 발생했습니다.');
    }
  };

  // 티타임 참여 목록 조회
  const fetchMyTeatimeParticipateList = async () => {
    try {
      const response = await getMyTeatimeParticipateList({
        status,
        page: participatePagination.page,
        perPage: participatePagination.perPage,
      });
      setParticipateList(response.data.items);
      setParticipatePagination(response.data.pagination);
      setParticipateError(null); // 성공 시 오류 초기화
    } catch (error) {
      console.error('Error fetching my teatime participate list:', error);
      setParticipateError(
        '참여한 티타임 목록을 가져오는 데 문제가 발생했습니다.'
      );
    }
  };

  // 컴포넌트 마운트 시 작성 티타임 목록 조회
  useEffect(() => {
    fetchMyTeatimeWriteList();
  }, [writePagination.page, writePagination.perPage]);

  // 상태 변경 시 참여 티타임 목록 조회
  useEffect(() => {
    fetchMyTeatimeParticipateList();
  }, [status, participatePagination.page, participatePagination.perPage]);

  return (
    <div>
      <h1 className="font-semibold text-2xl">나의 티타임</h1>

      {/* 내가 작성한 티타임 */}
      <div className="my-4">
        <h3 className="font-semibold">내가 작성한 티타임</h3>
        {writeError ? (
          <p className="text-red-500">{writeError}</p>
        ) : writeList.length === 0 ? (
          <p>작성한 티타임이 없습니다.</p>
        ) : (
          <ul>
            {writeList.map((item) => (
              <li key={item.boardId} className="border-b py-2">
                <h4 className="font-bold">{item.title}</h4>
                <p>{item.content}</p>
                <p>작성일: {new Date(item.createdDate).toLocaleDateString()}</p>
                <p>
                  방송일: {new Date(item.broadcastDate).toLocaleDateString()}
                </p>
                <p>마감일: {new Date(item.endDate).toLocaleDateString()}</p>
                <p>
                  참여자: {item.participants} / {item.maxParticipants}
                </p>
                <p>조회수: {item.viewCount}</p>
              </li>
            ))}
          </ul>
        )}
        {/* 페이지네이션 컴포넌트 추가 */}
      </div>

      {/* 참여한 티타임 */}
      <div className="my-4">
        <h3 className="font-semibold">참여한 티타임</h3>
        <div className="mb-4">
          <button
            onClick={() => setStatus('before')}
            className={`px-4 py-2 ${status === 'before' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            전체
          </button>
          <button
            onClick={() => setStatus('ongoing')}
            className={`px-4 py-2 ${status === 'ongoing' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            진행 중
          </button>
        </div>
        {participateError ? (
          <p className="text-red-500">{participateError}</p>
        ) : participateList.length === 0 ? (
          <p>참여한 티타임이 없습니다.</p>
        ) : (
          <ul>
            {participateList.map((item) => (
              <li key={item.teatimeBoardId} className="border-b py-2">
                <h4 className="font-bold">{item.title}</h4>
                <p>{item.content}</p>
                <p>작성자: {item.nickname}</p>
                <p>작성일: {new Date(item.createdDate).toLocaleDateString()}</p>
                <p>
                  참여자: {item.participants} / {item.maxParticipants}
                </p>
                <p>조회수: {item.viewCount}</p>
              </li>
            ))}
          </ul>
        )}
        {/* 페이지네이션 컴포넌트 추가 */}
      </div>
    </div>
  );
};

export default Teatimes;
