import { useState } from 'react';
import { useTeatime } from '../../../hooks/useTeatime';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

interface TeatimeHostButtonProps {
  boardType: string;
  title: string;
}

export default function TeatimeHostButton({
  boardType,
  title,
}: TeatimeHostButtonProps) {
  const { boardId } = useParams<{ boardId: string }>();
  const { startTeatime } = useTeatime(boardType, title);
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['teatimes'],
    queryFn: fetchTeatimeData,
  });

  async function fetchTeatimeData() {
    return axiosInstance
      .get(`/${boardType}/${boardId}`)
      .then((res) => res.data.data);
  }

  const checkButtonDisable = () => {
    const { broadcastDate } = isSuccess && data;
    const isValid =
      dayjs() >= dayjs(`${broadcastDate}`).subtract(30, 'm') &&
      dayjs() <= dayjs(`${broadcastDate}`).add(30, 'm');

    if (isValid) return false;
    return true;
  };

  return (
    !isLoading &&
    <button
      className="btn rounded bg-tea hover:bg-rose-400 text-white"
      onClick={startTeatime}
      disabled={checkButtonDisable()}
    >
      티타임 시작하기
    </button>
  );
}
