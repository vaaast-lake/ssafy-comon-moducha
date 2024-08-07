import axios from 'axios';
import { GroupedTracks } from '../../../types/WebRTCType';
import RoomAudio from './RoomAudio';
import RoomVideo from './RoomVideo';
import useConfigureUrls from '../../../hooks/useConfigureUrls';
import { GoUnmute } from 'react-icons/go';
import { IoVideocamOutline } from 'react-icons/io5';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { useMemo, useState } from 'react';

interface RoomRemoteTrackProps {
  remoteTracks: GroupedTracks;
}

export default function RoomRemoteTrack({ remoteTracks }: RoomRemoteTrackProps) {
  const [showFirstGroup, setShowFirstGroup] = useState<boolean>(true);
  const { APPLICATION_SERVER_URL } = useConfigureUrls();

  const remoteTrackArray = useMemo(
    () => Object.entries(remoteTracks),
    [remoteTracks]
  );
  const firstGroup = remoteTrackArray.slice(0, 3);
  const secondGroup = remoteTrackArray.slice(-3);
  const currentGroup = showFirstGroup ? firstGroup : secondGroup;

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

  const toggleGroup = (isFirst: boolean) => {
    setShowFirstGroup(() => isFirst);
  }

  return (
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
};
