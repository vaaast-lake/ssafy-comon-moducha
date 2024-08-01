import { LocalVideoTrack, Room } from 'livekit-client';
import RoomVideo from './RoomVideo';
import RoomAudio from './RoomAudio';
import { TrackInfo } from '../../../types/WebRTCType';
import { useState } from 'react';

interface RoomVideoAudioProps {
  room: Room;
  localTrack: LocalVideoTrack | undefined;
  participantName: string;
  remoteTracks: TrackInfo[];
}

const RoomVideoAudioTracks = ({
  room,
  localTrack,
  participantName,
  remoteTracks,
}: RoomVideoAudioProps) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const muteLocalAudio = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    room.localParticipant.setMicrophoneEnabled(false);
    setIsMuted((prev) => !prev);
  };

  const unmuteLocalAudio = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    room.localParticipant.setMicrophoneEnabled(true);
    setIsMuted((prev) => !prev);
  };

  return (
    <>
      <div id="layout-container" className="flex">
        <div id="video-container" className="">
          {/* screen_share video start */}
          {remoteTracks.map((remoteTrack) => {
            if (remoteTrack.trackPublication.source !== 'screen_share')
              return null;
            return remoteTrack.trackPublication.kind === 'video' ? (
              <RoomVideo
                key={remoteTrack.trackPublication.trackSid}
                track={remoteTrack.trackPublication.videoTrack!}
                participantIdentity={remoteTrack.participantIdentity}
              />
            ) : (
              <RoomAudio
                key={remoteTrack.trackPublication.trackSid}
                track={remoteTrack.trackPublication.audioTrack!}
                participantIdentity={remoteTrack.participantIdentity}
              />
            );
          })}
          {/* screen_share video end */}
          {/* local video start */}
          {localTrack && (
            <div>
              <RoomVideo
                track={localTrack}
                participantIdentity={participantName}
                local={true}
              />
              {!isMuted ? (
                <button
                  onClick={muteLocalAudio}
                  className="bg-blue-500 text-white px-4 py-1 rounded ml-2 hover:bg-blue-600"
                >
                  mute
                </button>
              ) : (
                <button
                  onClick={unmuteLocalAudio}
                  className="bg-red-500 text-white px-4 py-1 rounded ml-2 hover:bg-red-600"
                >
                  unmute
                </button>
              )}
            </div>
          )}
          {/* local video end */}
          {/* remote video start */}
          <div>
            {remoteTracks.map((remoteTrack) => {
              if (remoteTrack.trackPublication.source === 'screen_share')
                return null;
              return remoteTrack.trackPublication.kind === 'video' ? (
                <>
                  <RoomVideo
                    key={remoteTrack.trackPublication.trackSid}
                    track={remoteTrack.trackPublication.videoTrack!}
                    participantIdentity={remoteTrack.participantIdentity}
                    />
                </>
              ) : (
                <RoomAudio
                  key={remoteTrack.trackPublication.trackSid}
                  track={remoteTrack.trackPublication.audioTrack!}
                  participantIdentity={remoteTrack.participantIdentity}
                />
              );
            })}
          </div>
          {/* local video end */}
        </div>
      </div>
    </>
  );
};

export default RoomVideoAudioTracks;