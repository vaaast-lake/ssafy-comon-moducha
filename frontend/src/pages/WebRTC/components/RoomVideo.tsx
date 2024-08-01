import { LocalVideoTrack, RemoteVideoTrack } from 'livekit-client';
import './VideoComponent.css';
import { useEffect, useRef } from 'react';
import axios from 'axios';
import useConfigureUrls from '../../../hooks/useConfigureUrls';

interface VideoComponentProps {
  track: LocalVideoTrack | RemoteVideoTrack;
  participantIdentity: string;
  local?: boolean;
}

export default function RoomVideo({
  track,
  participantIdentity,
  local = false,
}: VideoComponentProps) {
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const { APPLICATION_SERVER_URL } = useConfigureUrls();

  const handleKickUser = () => {
    axios({
      method: 'post',
      url: `${APPLICATION_SERVER_URL}/teatimes/7/lives/kick/1`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: `${participantIdentity}`,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMuteUser = () => {
    axios({
      method: 'post',
      url: `${APPLICATION_SERVER_URL}/teatimes/7/lives/mute/1`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        userId: `${participantIdentity}`,
        trackSid: `${track.sid}`
      }
    })
    .then((res) => {
      console.log(res);
      
    })
    .catch((err) => {
      console.log(err);
      
    })
  }

  useEffect(() => {
    if (videoElement.current) {
      // attach 관련 설명. 현재 트랙을 html 요소와 연결하고자 할 때 사용.
      // https://docs.livekit.io/realtime/client/receive/
      track.attach(videoElement.current);
    }

    return () => {
      track.detach();
    };
  }, [track]);

  return (
    <div id={'camera-' + participantIdentity}>
      <div className="participant-data">
        <p>{participantIdentity + (local ? ' (You)' : '')}</p>
      </div>
      <video ref={videoElement} id={track.sid}></video>
      <button
        className="bg-gray-500 text-white px-4 py-1 rounded ml-2 hover:bg-gray-600"
        onClick={handleKickUser}
      >
        KICK
      </button>
      {participantIdentity !== '1' && 
        <button
          className="bg-yellow-500 text-white px-4 py-1 rounded ml-2 hover:bg-yellow-600"
          onClick={handleMuteUser}
        >
          REMOTE USER MUTE VIDEO
        </button>
      }
    </div>
  );
}
