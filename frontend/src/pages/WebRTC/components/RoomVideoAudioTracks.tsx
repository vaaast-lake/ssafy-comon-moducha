import { LocalVideoTrack, Room } from 'livekit-client';
import RoomVideo from './RoomVideo';
import { GroupedTracks, TrackInfo, trackKind } from '../../../types/WebRTCType';
import { useEffect, useState } from 'react';
import RoomSharingButton from './RoomSharingButton';
import { GoUnmute, GoMute } from 'react-icons/go';
import RoomRemoteTrack from './RoomRemoteTrack';

interface RoomVideoAudioProps {
  room: Room;
  localTrack: LocalVideoTrack | undefined;
  participantName: string;
  remoteTracks: GroupedTracks;
  isScreenSharing: boolean;
  leaveRoom: () => void;
}

interface ScreenShareTrack {
  isScreenShare: boolean;
  screenShareTrack?: {
    [key in trackKind]?: TrackInfo | undefined;
  };
}

const RoomVideoAudioTracks = ({
  room,
  localTrack,
  participantName,
  remoteTracks,
  isScreenSharing,
  leaveRoom,
}: RoomVideoAudioProps) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [screenShare, setScreenShare] = useState<ScreenShareTrack>({isScreenShare: false});

  useEffect(() => {
    const screenShareTrack = Object.values(remoteTracks).find(
      (tracks) => tracks?.video?.trackPublication.source === 'screen_share'
    )
    
    if (screenShareTrack) {
      setScreenShare({isScreenShare: true, screenShareTrack})
    }
    else {
      setScreenShare({isScreenShare: false})
    }
  }, [remoteTracks])

  const handleLocalAudio = () => {
    setIsMuted((prev) => !prev);
    room.localParticipant.setMicrophoneEnabled(isMuted);
  };

  return (
    <div
      className="
        screen-container 
        col-span-9
        grid
        grid-rows-12
      "
    >
      <div className='local-share-container relative row-span-7'>
        {/* screen_share video start */}
        {screenShare.isScreenShare &&
          <div className="screen-share-container w-full h-full">
            <RoomVideo
              key={screenShare.screenShareTrack?.video?.trackPublication.trackSid}
              track={screenShare.screenShareTrack!.video!.trackPublication.videoTrack!}
              participantIdentity={screenShare.screenShareTrack!.video!.participantIdentity}
            />
          </div>
        }
        {/* screen_share video end */}

        {/* local video start */}
        {localTrack && (
          <div
            className={`
              local-video-container
              ${screenShare.isScreenShare ? 
                'absolute top-0 right-0 w-2/6' : 
                'w-full h-full'
              }
            `}
          >
            <RoomVideo
              track={localTrack}
              participantIdentity={participantName}
              local={true}
            />
          </div>
        )}
        {/* local video end */}
      </div>

      {/* remote video start */}
      <RoomRemoteTrack remoteTracks={remoteTracks} />
      {/* remote video end */}

      <div className="room-controller row-span-2 flex justify-center items-center relative border-e-2">
        <div
          className="
              local-contoller 
              flex gap-3
            "
        >
          <button
            onClick={handleLocalAudio}
            className={`
                ${
                  !isMuted
                    ? 'bg-blue-500 text-white px-4 py-1 rounded ml-2 hover:bg-blue-600'
                    : 'bg-red-500 text-white px-4 py-1 rounded ml-2 hover:bg-red-600'
                }
                px-2 py-3
                text-3xl
              `}
          >
            {!isMuted ? <GoUnmute /> : <GoMute />}
          </button>
          <RoomSharingButton room={room} isScreenSharing={isScreenSharing} />
        </div>
        <button
          className="
              leave-room-button 
              absolute end-1
              bg-red-500 hover:bg-red-600 rounded
              text-white text-lg
              me-3 px-4 py-3
            "
          onClick={leaveRoom}
        >
          통화 종료
        </button>
      </div>
    </div>
  );
};

export default RoomVideoAudioTracks;
