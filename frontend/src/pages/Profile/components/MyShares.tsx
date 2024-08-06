import { useEffect, useState } from 'react';
import useAuthStore from '../../../stores/authStore';
// 더미
const Shares = () => {
  const { accessToken, user_id } = useAuthStore();
  const [participatedShares, setParticipatedShares] = useState([]);
  const [writtenShares, setWrittenShares] = useState([]);
  const [paginationParticipated, setPaginationParticipated] = useState({
    page: 1,
    total: 0,
  });
  const [paginationWritten, setPaginationWritten] = useState({
    page: 1,
    total: 0,
  });

  useEffect(() => {
    const fetchParticipatedShares = async () => {
      try {
        const response = await fetch(
          `/users/${user_id}/participated-shares?page=${paginationParticipated.page}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const result = await response.json();
          setParticipatedShares(result.data.items);
          setPaginationParticipated(result.data.pagination);
        } else {
          console.error('Failed to fetch participated shares');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchParticipatedShares();
  }, [paginationParticipated.page, accessToken, user_id]);

  useEffect(() => {
    const fetchWrittenShares = async () => {
      try {
        const response = await fetch(
          `/users/${user_id}/shares?page=${paginationWritten.page}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const result = await response.json();
          setWrittenShares(result.data.items);
          setPaginationWritten(result.data.pagination);
        } else {
          console.error('Failed to fetch written shares');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchWrittenShares();
  }, [paginationWritten.page, accessToken, user_id]);

  return (
    <div>
      <h1 className="font-semibold text-2xl">나의 나눔 / 교환</h1>
      <div>
        <h3 className="font-semibold">참여한 나눔</h3>
        {participatedShares.length > 0 ? (
          <ul>
            {participatedShares.map((share) => (
              <li key={share.shareBoardId}>
                <h4>{share.title}</h4>
                <p>{share.content}</p>
                <small>{share.createdDate}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>참여한 나눔이 없습니다.</p>
        )}
        <div>
          {paginationParticipated.page > 1 && (
            <button
              onClick={() =>
                setPaginationParticipated((prev) => ({
                  ...prev,
                  page: prev.page - 1,
                }))
              }
            >
              이전
            </button>
          )}
          {paginationParticipated.page <
            Math.ceil(paginationParticipated.total / 10) && (
            <button
              onClick={() =>
                setPaginationParticipated((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }))
              }
            >
              다음
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold">작성한 나눔</h3>
        {writtenShares.length > 0 ? (
          <ul>
            {writtenShares.map((share) => (
              <li key={share.shareBoardId}>
                <h4>{share.title}</h4>
                <p>{share.content}</p>
                <small>{share.createdDate}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 나눔이 없습니다.</p>
        )}
        <div>
          {paginationWritten.page > 1 && (
            <button
              onClick={() =>
                setPaginationWritten((prev) => ({
                  ...prev,
                  page: prev.page - 1,
                }))
              }
            >
              이전
            </button>
          )}
          {paginationWritten.page < Math.ceil(paginationWritten.total / 10) && (
            <button
              onClick={() =>
                setPaginationWritten((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }))
              }
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shares;
