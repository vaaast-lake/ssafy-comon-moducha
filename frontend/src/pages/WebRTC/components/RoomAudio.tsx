import { LocalAudioTrack, RemoteAudioTrack } from 'livekit-client';
import { useEffect, useRef } from 'react';
import useConfigureUrls from '../../../hooks/useConfigureUrls';
import axios from 'axios';

interface RoomAudioProps {
  track: LocalAudioTrack | RemoteAudioTrack;
  participantIdentity: string;
}

export default function RoomAudio({ track, participantIdentity }: RoomAudioProps) {
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const { APPLICATION_SERVER_URL } = useConfigureUrls();

  useEffect(() => {
    if (audioElement.current) {
      track.attach(audioElement.current);
    }

    return () => {
      track.detach();
    };
  }, [track]);

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

  return (
    <div id='audio-box'>
      <audio ref={audioElement} id={track.sid} />
      <button
        className="bg-yellow-500 text-white px-4 py-1 rounded ml-2 hover:bg-yellow-600"
        onClick={handleMuteUser}
      >
        REMOTE USER MUTE AUDIO
      </button>
    </div> 
  );
}