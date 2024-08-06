import axios from 'axios';
import { TrackInfo } from '../../../types/WebRTCType';
import RoomAudio from './RoomAudio';
import RoomVideo from './RoomVideo';
import useConfigureUrls from '../../../hooks/useConfigureUrls';

interface RoomRemoteTrackProps {
  remoteTrack: TrackInfo;
}

export default function RoomRemoteTrack({
  remoteTrack,
}: RoomRemoteTrackProps) {
  const { trackPublication, participantIdentity } = remoteTrack;
  const { APPLICATION_SERVER_URL } = useConfigureUrls();

  const handleMuteRemoteUserVideo = () => {
    axios({
      method: 'post',
      url: `${APPLICATION_SERVER_URL}/teatimes/7/lives/mute/1`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        userId: `${participantIdentity}`,
        trackSid: `${trackPublication.videoTrack!.trackSid}`
      }
    })
    .then((res) => {
      console.log(res);
      
    })
    .catch((err) => {
      console.log(err);
      
    })
  }


  return (
    <div id='RoomRemoteTrack'>
      {remoteTrack.trackPublication.kind === 'video' ? (
          <RoomVideo
            key={trackPublication.trackSid}
            track={trackPublication.videoTrack!}
            participantIdentity={participantIdentity}
            />
        ) : (
          <RoomAudio
            key={trackPublication.trackSid}
            track={trackPublication.audioTrack!}
          />
        )
      }
      {participantIdentity !== '1' && 
        trackPublication.source === 'camera' &&
        <button
          className="bg-yellow-500 text-white px-4 py-1 rounded ml-2 hover:bg-yellow-600"
          onClick={handleMuteRemoteUserVideo}
        >
          REMOTE USER MUTE VIDEO
        </button>
      }
    </div>
  );
}
