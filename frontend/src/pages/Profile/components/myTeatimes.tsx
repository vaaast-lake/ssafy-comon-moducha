import { useEffect, useState } from 'react';
import useAuthStore from '../../../stores/authStore';
import MyTeatime from '../../Home/componenets/MyTeatime';
// 더미
const Teatimes = () => {
  const { accessToken, user_id } = useAuthStore();
  const [participatedTeatimes, setParticipatedTeatimes] = useState([]);
  const [writtenTeatimes, setWrittenTeatimes] = useState([]);
  const [paginationParticipated, setPaginationParticipated] = useState({
    page: 1,
    total: 0,
  });
  const [paginationWritten, setPaginationWritten] = useState({
    page: 1,
    total: 0,
  });

  useEffect(() => {
    const fetchParticipatedTeatimes = async () => {
      try {
        const response = await fetch(
          `/api/v1/users/${user_id}/participated-teatimes?page=${paginationParticipated.page}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const result = await response.json();
          setParticipatedTeatimes(result.data.items);
          setPaginationParticipated(result.data.pagination);
        } else {
          console.error('Failed to fetch participated teatimes');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchParticipatedTeatimes();
  }, [paginationParticipated.page, accessToken, user_id]);

  useEffect(() => {
    const fetchWrittenTeatimes = async () => {
      try {
        const response = await fetch(
          `/api/v1/users/${user_id}/teatimes?page=${paginationWritten.page}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const result = await response.json();
          setWrittenTeatimes(result.data.items);
          setPaginationWritten(result.data.pagination);
        } else {
          console.error('Failed to fetch written teatimes');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchWrittenTeatimes();
  }, [paginationWritten.page, accessToken, user_id]);

  return (
    <div>
      <h1 className="font-semibold text-2xl">나의 티타임</h1>
      <div>
        <h3 className="font-semibold">참여한 티타임</h3>
        <MyTeatime className="flex flex-col gap-4" />
        {participatedTeatimes.length > 0 ? (
          <ul>
            {participatedTeatimes.map((teatime) => (
              <li key={teatime.teatimeBoardId}>
                <h4>{teatime.title}</h4>
                <p>{teatime.content}</p>
                <small>{teatime.createdDate}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>참여한 티타임이 없습니다.</p>
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
        <h3 className="font-semibold">작성한 티타임</h3>
        {writtenTeatimes.length > 0 ? (
          <ul>
            {writtenTeatimes.map((teatime) => (
              <li key={teatime.teatimeBoardId}>
                <h4>{teatime.title}</h4>
                <p>{teatime.content}</p>
                <small>{teatime.createdDate}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 티타임이 없습니다.</p>
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
      <br />
    </div>
  );
};

export default Teatimes;
