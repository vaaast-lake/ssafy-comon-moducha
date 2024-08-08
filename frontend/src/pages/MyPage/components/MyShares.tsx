// MyShares.tsx
import { useState, useEffect } from 'react';
import getParticipatedShares from '../api/getMySharesParticipated';
import getMySharesWriteList from '../api/getMySharesWriteList';

interface ShareItem {
  id: string;
  title: string;
  status: 'ongoing' | 'completed';
  // 필요한 다른 필드들 추가
}

const MyShares = () => {
  const [participatedShares, setParticipatedShares] = useState<ShareItem[]>([]);
  const [myShares, setMyShares] = useState<ShareItem[]>([]);
  const [participatedStatus, setParticipatedStatus] = useState<
    'all' | 'ongoing'
  >('all');
  const [mySharesStatus, setMySharesStatus] = useState<'all' | 'ongoing'>(
    'all'
  );
  const [loading, setLoading] = useState<boolean>(false);

  // 참여한 나눔 목록 조회
  const fetchParticipatedShares = async () => {
    setLoading(true);
    try {
      const response = await getParticipatedShares({
        status: participatedStatus,
      });
      setParticipatedShares(response.data.items);
    } catch (error) {
      console.error('참여한 나눔 목록을 가져오는 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  // 작성한 나눔 목록 조회
  const fetchMyShares = async () => {
    setLoading(true);
    try {
      const response = await getMySharesWriteList({ status: mySharesStatus });
      setMyShares(response.items);
    } catch (error) {
      console.error('작성한 나눔 목록을 가져오는 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipatedShares();
    fetchMyShares();
  }, [participatedStatus, mySharesStatus]);

  return (
    <div>
      <h1 className="font-semibold text-2xl">나의 나눔 / 교환</h1>
      <div className="my-4">
        <h3 className="font-semibold">참여한 나눔</h3>
        <div className="mb-2">
          <button
            onClick={() => setParticipatedStatus('all')}
            className={`mr-2 px-4 py-2 ${participatedStatus === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            전체
          </button>
          <button
            onClick={() => setParticipatedStatus('ongoing')}
            className={`px-4 py-2 ${participatedStatus === 'ongoing' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            진행중
          </button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {participatedShares.map((share) => (
              <li
                key={share.id}
                className="mb-2 p-4 border border-gray-300 rounded"
              >
                <h4 className="font-semibold">{share.title}</h4>
                <p>Status: {share.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="my-4">
        <h3 className="font-semibold">작성한 나눔</h3>
        <div className="mb-2">
          <button
            onClick={() => setMySharesStatus('all')}
            className={`mr-2 px-4 py-2 ${mySharesStatus === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            전체
          </button>
          <button
            onClick={() => setMySharesStatus('ongoing')}
            className={`px-4 py-2 ${mySharesStatus === 'ongoing' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            진행중
          </button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {myShares.map((share) => (
              <li
                key={share.id}
                className="mb-2 p-4 border border-gray-300 rounded"
              >
                <h4 className="font-semibold">{share.title}</h4>
                <p>Status: {share.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyShares;
