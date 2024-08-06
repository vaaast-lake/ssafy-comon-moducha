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
  const [showFirstGroup, setShowFirstGroup] = useState<boolean>(true);
  const { APPLICATION_SERVER_URL } = useConfigureUrls();

  const remoteTrackArray = useMemo(() => Object.entries(remoteTracks), [remoteTracks]);

  const firstGroup = remoteTrackArray.slice(0, 3);
  const secondGroup  = remoteTrackArray.slice(-3);

  const currentGroup = showFirstGroup ? firstGroup : secondGroup;

  const toggleGroup = (isFirst: boolean) => {
    setShowFirstGroup(() => isFirst);
  }

  const handleLocalAudio = () => {
    setIsMuted((prev) => !prev);
    room.localParticipant.setMicrophoneEnabled(isMuted);
  };

  const handleMuteAudioRemoteUser = (
    participantIdentity: string,
    trackSid: string | undefined
  ) => {
    axios({
      method: 'post',
      url: `${APPLICATION_SERVER_URL}/teatimes/7/lives/mute/1`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        userId: `${participantIdentity}`,
        trackSid: `${trackSid}`,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMuteScreenRemoteUser = (
    participantIdentity: string,
    trackSid: string | undefined
  ) => {
    axios({
      method: 'post',
      url: `${APPLICATION_SERVER_URL}/teatimes/7/lives/mute/1`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        userId: `${participantIdentity}`,
        trackSid: `${trackSid}`,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleKickUser = (participantIdentity: string) => {
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
      <div
        className="
          remote-video-container
          row-span-3
          pt-2
          flex
          flex-col
          w-full h-full
        "
      >
        <div className="remote-video-wrapper gap-3 grid grid-cols-12 row-span-11 w-full h-full">
          {currentGroup.map(([participantIdentity, tracks]) => {
            const videoTrackSid = tracks?.video?.trackPublication.trackSid;
            const audioTrackSid = tracks?.audio?.trackPublication.trackSid;

            return (
              <>
                {tracks && (
                  <div
                    key={participantIdentity}
                    className="
                      participant-container 
                      relative
                      col-span-4
                    "
                  >
                    <div className="participant-screen w-full h-full">
                      {tracks.video &&
                        tracks.video.trackPublication.source !==
                          'screen_share' && (
                          <RoomVideo
                            key={videoTrackSid}
                            track={tracks!.video!.trackPublication.videoTrack!}
                            participantIdentity={participantIdentity}
                          />
                        )}
                      {tracks.audio && (
                        <RoomAudio
                          key={audioTrackSid}
                          track={tracks!.audio!.trackPublication.audioTrack!}
                          participantIdentity={participantIdentity}
                        />
                      )}
                    </div>
                    {participantIdentity !== '1' && (
                      <div
                        className="
                          participant-controller 
                          absolute bottom-2 end-2
                          text-xl
                        "
                      >
                        <button
                          className="bg-yellow-500 text-white px-4 py-1 rounded ml-2 hover:bg-yellow-600"
                          onClick={() =>
                            handleMuteAudioRemoteUser(
                              participantIdentity,
                              audioTrackSid
                            )
                          }
                        >
                          <GoUnmute />
                        </button>
                        <button
                          className="bg-yellow-500 text-white px-4 py-1 rounded ml-2 hover:bg-yellow-600"
                          onClick={() =>
                            handleMuteScreenRemoteUser(
                              participantIdentity,
                              videoTrackSid
                            )
                          }
                        >
                          <IoVideocamOutline />
                        </button>
                        <button
                          className="bg-gray-500 text-white px-4 py-1 rounded ml-2 hover:bg-gray-600"
                          onClick={() => handleKickUser(participantIdentity)}
                        >
                          <RiLogoutBoxRLine />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            );
          })}
        </div>
        <div className='page-button-container flex justify-center gap-2 py-2 flex-1'>
          <button 
            className={`
              ${showFirstGroup ? 'bg-blue-600' : 'bg-blue-300 hover:bg-blue-600'}
              w-40 h-2 rounded-xl transition-colors
            `}
            onClick={() => toggleGroup(true)}
          />
          <button 
            className={`
              ${showFirstGroup ? 'bg-blue-300 hover:bg-blue-600' : 'bg-blue-600'}
              w-40 h-2 rounded-xl transition-colors
            `}
            onClick={() => toggleGroup(false)}
          />
        </div>
      </div>
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
