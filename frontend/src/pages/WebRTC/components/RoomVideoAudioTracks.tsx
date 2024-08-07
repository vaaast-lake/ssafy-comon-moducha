import { LocalVideoTrack, Room } from 'livekit-client';
import RoomVideo from './RoomVideo';
import RoomAudio from './RoomAudio';
import { GroupedTracks } from '../../../types/WebRTCType';
import { useMemo, useState } from 'react';
import axios from 'axios';
import useConfigureUrls from '../../../hooks/useConfigureUrls';
import RoomSharingButton from './RoomSharingButton';
import { GoUnmute, GoMute } from 'react-icons/go';
import { IoVideocamOutline } from 'react-icons/io5';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import RoomRemoteTrack from './RoomRemoteTrack';

interface RoomVideoAudioProps {
  room: Room;
  localTrack: LocalVideoTrack | undefined;
  participantName: string;
  remoteTracks: GroupedTracks;
  isScreenSharing: boolean;
  leaveRoom: () => void;
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
      {/* screen_share video start */}
      {Object.entries(remoteTracks).map(
        ([participantIdentity, tracks]) =>
          tracks &&
          tracks.video &&
          tracks.video.trackPublication.source === 'screen_share' && (
            <div className="screen-share-container">
              <RoomVideo
                key={tracks.video.trackPublication.trackSid}
                track={tracks.video.trackPublication.videoTrack!}
                participantIdentity={participantIdentity}
              />
            </div>
          )
      )}
      {/* screen_share video end */}

      {/* local video start */}
      {localTrack && (
        <div
          className={`
            local-video-container
            relative  
            row-span-7
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
                ${!isMuted
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
