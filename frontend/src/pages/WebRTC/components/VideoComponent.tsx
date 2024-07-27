import { LocalVideoTrack, RemoteVideoTrack } from 'livekit-client';
import './VideoComponent.css';
import { useEffect, useRef } from 'react';

interface VideoComponentProps {
  track: LocalVideoTrack | RemoteVideoTrack;
  participantIdentity: string;
  local?: boolean;
}

function VideoComponent({
  track,
  participantIdentity,
  local = false,
}: VideoComponentProps) {
  const videoElement = useRef<HTMLVideoElement | null>(null);

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
    <div id={'camera-' + participantIdentity} className="video-container">
      <div className="participant-data">
        <p>{participantIdentity + (local ? ' (You)' : '')}</p>
      </div>
      <video ref={videoElement} id={track.sid}></video>
    </div>
  );
}

export default VideoComponent;
