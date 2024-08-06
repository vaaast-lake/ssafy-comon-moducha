import React from 'react';
import {
  LocalVideoTrack,
  ParticipantEvent,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track,
} from 'livekit-client';
import getOpenViduToken from '../../../api/getOpenViduToken';
import { GroupedTracks, Message, trackKind } from '../../../types/WebRTCType';

interface JoinRoomProps {
  APPLICATION_SERVER_URL: string;
  LIVEKIT_URL: string;
  participantName: string;
  roomName: string;
  setRoom: React.Dispatch<React.SetStateAction<Room | undefined>>;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  setParticipantName: React.Dispatch<React.SetStateAction<string>>;
  setRemoteTracks: React.Dispatch<React.SetStateAction<GroupedTracks>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalTrack: React.Dispatch<
    React.SetStateAction<LocalVideoTrack | undefined>
  >;
  leaveRoom: () => void;
}

const JoinRoom = ({
  APPLICATION_SERVER_URL,
  LIVEKIT_URL,
  participantName,
  roomName,
  setRoom,
  setRoomName,
  setParticipantName,
  setRemoteTracks,
  setMessages,
  setIsScreenSharing,
  setLocalTrack,
  leaveRoom,
}: JoinRoomProps) => {
  const handleJoinRoom = async () => {
    const room = new Room();
    setRoom(room);

    room
      .on(
        RoomEvent.TrackSubscribed,
        (
          _track: RemoteTrack,
          publication: RemoteTrackPublication,
          participant: RemoteParticipant
        ) => {
          setRemoteTracks((prev) => {
            const newGroupedTracks = { ...prev };

            if (!newGroupedTracks[participant.identity])
              newGroupedTracks[participant.identity] = {};

            newGroupedTracks[participant.identity]![
              publication.kind as trackKind
            ] = {
              participantIdentity: participant.identity,
              trackPublication: publication,
            };

            return newGroupedTracks;
          });
          console.log(publication);
        }
      )
      .on(
        RoomEvent.TrackUnsubscribed,
        (
          _track: RemoteTrack,
          publication: RemoteTrackPublication,
          participant: RemoteParticipant
        ) => {
          setRemoteTracks((prev) => {
            const newGroupedTracks = { ...prev };
            newGroupedTracks[participant.identity] = null;
            return newGroupedTracks;
          });
        }
      )
      .on(
        // Chat message receiver
        RoomEvent.DataReceived,
        (payload, participant) => {
          const decoder = new TextDecoder();
          const message = decoder.decode(payload);
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: participant?.identity, content: message },
          ]);
        }
      )
      .on(
        // secreen sharing
        RoomEvent.LocalTrackPublished,
        (publication) => {
          if (publication.track?.source === Track.Source.ScreenShare) {
            setIsScreenSharing(true);
          }
          // console.log('-----------------------');
          // console.log('-----------------------');
          // console.log(publication);
          // console.log('-----------------------');
          // console.log('-----------------------');
        }
      )
      .on(RoomEvent.LocalTrackUnpublished, (publication) => {
        if (publication.track?.source === Track.Source.ScreenShare) {
          setIsScreenSharing(false);
        }
      })
      .on(RoomEvent.TrackMuted, (publication, participant) => {
        console.log('------Mute info------');
        console.log('------Mute info------');
        console.log(publication);
        console.log(participant);
        console.log('------Mute info------');
        console.log('------Mute info------');
      })
      .on(RoomEvent.TrackUnmuted, (publication, participant) => {
        console.log('------Mute info------');
        console.log('------Mute info------');
        console.log(publication);
        console.log(participant);
        console.log('------Mute info------');
        console.log('------Mute info------');
      });
    // .on(ParticipantEvent, () => {

    // });

    try {
      // console.log(APPLICATION_SERVER_URL);

      // Get a token from your application server with the room name and participant name
      const token = await getOpenViduToken(
        APPLICATION_SERVER_URL,
        roomName,
        participantName
      );

      console.log('getToken', token);

      // Connect to the room with the LiveKit URL and the token
      await room.connect(LIVEKIT_URL, token);

      console.log('access completed', LIVEKIT_URL);

      // Publish your camera and microphone
      await room.localParticipant.enableCameraAndMicrophone();
      setLocalTrack(
        room.localParticipant.videoTrackPublications.values().next().value
          .videoTrack
      );

      // console.log('-----------------');
      // console.log('-----------------');
      // console.log(room.localParticipant);
      // console.log('-----------------');
      // console.log('-----------------');
    } catch (error) {
      console.log(
        'There was an error connecting to the room:',
        (error as Error).message
      );
      leaveRoom();
    }
  };

  return (
    <>
      <div id="join" className='flex justify-center items-center h-screen w-screen'>
        <div id="join-dialog" className='grid grid-rows-12 items-center h-5/6 w-10/12 border border-y-tea border-y-2 border-x-0 bg-teabg'>
          <h2 className='text-6xl flex-1 text-center row-span-2'>대기실</h2>
          <div className='pre-join-screen row-start-3 row-span-8 bg-slate-50'>1</div>
          <form 
            className='flex flex-col row-start-11 row-span-2 gap-6 items-center w-full'
            onSubmit={(e) => {
              handleJoinRoom();
              e.preventDefault();
            }}
          >
            <div className='room-info flex felx-1 gap-10 w-3/5 justify-between'>
              <div className='info-participant flex-1 w-3/12'>
                <label htmlFor="participant-name">참가자</label>
                <input
                  id="participant-name"
                  className="form-control bg-white text-black"
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  required
                />
              </div>
              <div className='info-room-name flex-1 w-3/12'>
                <label htmlFor="room-name">방 이름</label>
                <input
                  id="room-name"
                  className="form-control bg-white text-black"
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              className="btn btn-md w-3/5 btn-success flex-1"
              type="submit"
              disabled={!roomName || !participantName}
            >
              입장하기!
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default JoinRoom;
