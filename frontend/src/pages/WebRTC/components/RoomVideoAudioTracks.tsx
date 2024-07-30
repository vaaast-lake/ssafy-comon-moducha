import { LocalVideoTrack } from 'livekit-client';
import RoomVideo from './RoomVideo';
import RoomAudio from './RoomAudio';
import { TrackInfo } from '../../../types/WebRTCType';

interface RoomVideoAudioProps {
  localTrack: LocalVideoTrack | undefined;
  participantName: string;
  remoteTracks: TrackInfo[];
}

const RoomVideoAudioTracks = ({
  localTrack,
  participantName,
  remoteTracks,
}: RoomVideoAudioProps) => {
  return (
    <>
      <div id="layout-container" className="flex">
        <div id="video-container" className="">
          {/* screen_share video start */}
          {remoteTracks.map((remoteTrack) => {
              if (remoteTrack.trackPublication.source !== 'screen_share') return null
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
                />
              )
            }
          )}
          {/* screen_share video end */}
          {/* local video start */}
          {localTrack && (
            <RoomVideo
            track={localTrack}
            participantIdentity={participantName}
            local={true}
            />
          )}
          {/* local video end */}
          {/* remote video start */}
          {remoteTracks.map((remoteTrack) => {
            if (remoteTrack.trackPublication.source === 'screen_share') return null
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
              />
            )
          }
          )}
          {/* local video end */}
        </div>
      </div>
    </>
  );
};

export default RoomVideoAudioTracks;
