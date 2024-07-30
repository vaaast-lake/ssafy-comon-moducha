import React from 'react';
import { LocalVideoTrack } from 'livekit-client';
import VideoComponent from './VideoComponent';
import AudioComponent from './AudioComponent';
import { TrackInfo } from '../../../types/WebRTCType';

interface RoomVideoAudioProps {
  localTrack: LocalVideoTrack | undefined;
  participantName: string;
  remoteTracks: TrackInfo[];
}

const RoomVideoAudioTracks: React.FC<RoomVideoAudioProps> = ({
  localTrack,
  participantName,
  remoteTracks,
}) => {
  return (
    <>
      <div id="layout-container" className="flex">
        <div id="video-container" className="">
          {localTrack && (
            <VideoComponent
              track={localTrack}
              participantIdentity={participantName}
              local={true}
            />
          )}
          {remoteTracks.map((remoteTrack) =>
            remoteTrack.trackPublication.kind === 'video' ? (
              <VideoComponent
                key={remoteTrack.trackPublication.trackSid}
                track={remoteTrack.trackPublication.videoTrack!}
                participantIdentity={remoteTrack.participantIdentity}
              />
            ) : (
              <AudioComponent
                key={remoteTrack.trackPublication.trackSid}
                track={remoteTrack.trackPublication.audioTrack!}
              />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default RoomVideoAudioTracks;
