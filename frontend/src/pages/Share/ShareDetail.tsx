import { useEffect, useState } from 'react';
import { fetchShareDetail } from '../../api/fetchShare';
import { useParams } from 'react-router-dom';
import { ShareListItem } from '../../types/ShareType';

const ShareDetail = () => {
  const [shareDetail, setsShareDetail] = useState<ShareListItem>();
  const { shareId } = useParams();
  useEffect(() => {
    fetchShareDetail(shareId)
      .then((res) => setsShareDetail(res.data))
      .catch((err) => console.log(err));
  });
  return (
    <>
      <div></div>
    </>
  );
};

export default ShareDetail;
