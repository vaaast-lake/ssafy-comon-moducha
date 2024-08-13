import { GroupedTracks } from '../../../types/WebRTCType';
import RoomAudio from './RoomAudio';
import RoomVideo from './RoomVideo';
import { GoMute, GoUnmute } from 'react-icons/go';
import { IoVideocamOffOutline, IoVideocamOutline } from 'react-icons/io5';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { useMemo, useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';

interface RoomRemoteTrackProps {
  remoteTracks: GroupedTracks;
  apiData: { roomName: string; boardId: string; boardType: string };
}

export default function RoomRemoteTrack({
  remoteTracks,
  apiData,
}: RoomRemoteTrackProps) {
  const [showFirstGroup, setShowFirstGroup] = useState<boolean>(true);
  const { roomName, boardId, boardType } = apiData;
  const remoteTrackArray = useMemo(
    () => Object.entries(remoteTracks),
    [remoteTracks]
  );
  const firstGroup = remoteTrackArray.slice(0, 3);
  const secondGroup = remoteTrackArray.slice(-3);
  const currentGroup = showFirstGroup ? firstGroup : secondGroup;

  const handleMuteAudioRemoteUser = (
    participantIdentity: string,
    trackSid: string | undefined,
    isMute: boolean
  ) => {
    axiosInstance.post(`${boardType}/${boardId}/lives/mute`, {
      userId: `${participantIdentity}`,
      trackSid: `${trackSid}`,
      isMute: `${!isMute}`
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleMuteScreenRemoteUser = (
    participantIdentity: string,
    trackSid: string | undefined,
    isMute: boolean
  ) => {
    axiosInstance.post(`${boardType}/${boardId}/lives/mute`, {
      userId: `${participantIdentity}`,
      trackSid: `${trackSid}`,
      isMute: `${!isMute}`
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleKickUser = (participantIdentity: string) => {
    axiosInstance.post(`${boardType}/${boardId}/lives/kick`, (
      `${participantIdentity}`
    ))
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleGroup = (isFirst: boolean) => {
    setShowFirstGroup(() => isFirst);
  };

  return (
    <div
      className="
        remote-camera-container
        row-span-3
        pt-2
        flex flex-col
        w-full h-full
      "
    >
      <div className="remote-video-wrapper gap-3 grid grid-cols-12 row-span-11 w-full h-full">
        {currentGroup.map(([participantIdentity, tracks]) => {
          const videoTrackSid = tracks?.camera?.trackPublication.trackSid;
          const audioTrackSid = tracks?.microphone?.trackPublication.trackSid;

          return (
            <>
              {tracks && (
                <div
                  key={participantIdentity}
                  className="
                      participant-container 
                      relative
                      col-span-4
                      rounded-2xl overflow-hidden
                    "
                >
                  <div
                    className={`
                      participant-screen w-full h-full
                      ${tracks.camera?.isMute && 'bg-black bg-opacity-40'}
                    `}
                  >
                    {tracks.camera &&
                      tracks.camera.trackPublication.source !==
                        'screen_share' && (
                        <RoomVideo
                          key={videoTrackSid}
                          track={tracks!.camera!.trackPublication.videoTrack!}
                          participantName={tracks!.camera!.participantName}
                          participantIdentity={participantIdentity}
                        />
                      )}
                    {tracks.microphone && (
                      <RoomAudio
                        key={audioTrackSid}
                        track={tracks!.microphone!.trackPublication.audioTrack!}
                        participantIdentity={participantIdentity}
                      />
                    )}
                  </div>
                  {participantIdentity !== '1' && (
                    <div
                      className="
                          participant-controller 
                          absolute top-0 left-0
                          w-full h-full 
                          hover:bg-black hover:bg-opacity-40 transition-all
                          text-xl
                        "
                    >
                      <div
                        className="
                          button-container 
                          flex justify-center items-center
                          opacity-0 hover:opacity-100 transition-all
                          w-full h-full 
                        "
                      >
                        <button
                          className={`
                            text-white text-3xl px-5 py-2 rounded ml-2 transition-all
                            ${
                              tracks.microphone?.isMute
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-yellow-500 hover:bg-yellow-600'
                            }
                          `}
                          onClick={() =>
                            handleMuteAudioRemoteUser(
                              participantIdentity,
                              audioTrackSid,
                              tracks.microphone!.isMute
                            )
                          }
                        >
                          {tracks.microphone?.isMute ? <GoMute /> : <GoUnmute />}
                        </button>
                        <button
                          className={`
                            text-white text-3xl px-5 py-2 rounded ml-2 transition-all
                            ${
                              tracks.camera?.isMute
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-yellow-500 hover:bg-yellow-600'
                            }
                          `}
                          onClick={() =>
                            toggleMuteScreenRemoteUser(
                              participantIdentity,
                              videoTrackSid,
                              tracks.camera!.isMute
                            )
                          }
                        >
                          {tracks.camera?.isMute ? (
                            <IoVideocamOffOutline />
                          ) : (
                            <IoVideocamOutline />
                          )}
                        </button>
                        <button
                          className="bg-gray-500 text-white text-3xl px-5 py-2 rounded ml-2 hover:bg-gray-600"
                          onClick={() => handleKickUser(participantIdentity)}
                        >
                          <RiLogoutBoxRLine />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          );
        })}
      </div>
      <div className="page-button-container flex justify-center gap-2 py-2 flex-1">
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
  );
}
