import { useEffect, useState } from 'react';
import useAuthStore from '../../../stores/authStore';
// 더미
const Records = () => {
  const { accessToken, user_id } = useAuthStore();
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(
          `/api/v1/users/${user_id}/records?page=${pagination.page}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const result = await response.json();
          setRecords(result.data.items);
          setPagination(result.data.pagination);
        } else {
          console.error('Failed to fetch records');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    fetchRecords();
  }, [pagination.page, accessToken, user_id]);

  return (
    <div>
      <h1 className="font-semibold text-2xl">나의 기록</h1>
      {records.length > 0 ? (
        <ul>
          {records.map((record) => (
            <li key={record.recordId}>
              <h3>{record.title}</h3>
              <p>{record.content}</p>
              <small>{record.createdDate}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>기록이 없습니다.</p>
      )}
      <div>
        {pagination.page > 1 && (
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
          >
            이전
          </button>
        )}
        {pagination.page < Math.ceil(pagination.total / 10) && (
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
          >
            다음
          </button>
        )}
      </div>
      <br />
    </div>
  );
};

export default Records;
