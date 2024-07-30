import React from 'react';
import {
  LocalVideoTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track,
} from 'livekit-client';
import getOpenViduToken from '../../../api/getOpenViduToken';
import { Message, TrackInfo } from '../../../types/WebRTCType';

interface JoinRoomProps {
  APPLICATION_SERVER_URL: string;
  LIVEKIT_URL: string;
  participantName: string;
  roomName: string;
  setRoom: React.Dispatch<React.SetStateAction<Room | undefined>>;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  setParticipantName: React.Dispatch<React.SetStateAction<string>>;
  setRemoteTracks: React.Dispatch<React.SetStateAction<TrackInfo[]>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalTrack: React.Dispatch<
    React.SetStateAction<LocalVideoTrack | undefined>
  >;
  leaveRoom: () => void;
}

const JoinRoom: React.FC<JoinRoomProps> = ({
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
}) => {
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
          setRemoteTracks((prev) => [
            ...prev,
            {
              trackPublication: publication,
              participantIdentity: participant.identity,
            },
          ]);
          // track 정보를 ref에 등록하므로써 불필요한 랜더링을 제거하려는 거 같은데
          // 아직 이해 못 한 코드이므로 주석 처리
          // 관련 claud 주소 : https://claude.ai/chat/fee4f38d-d40a-45ef-9517-70321af27361
          // VideoComponents.tsx 와 동일하게 처리하면 될 듯. 추후 refactoring 필요
          // if (_track.source === Track.Source.ScreenShare) {
          //   setScreenShareTrack(_track);
          // }
          // console.log('subscribed_track', _track);
        }
      )
      .on(
        RoomEvent.TrackUnsubscribed,
        (_track: RemoteTrack, publication: RemoteTrackPublication) => {
          setRemoteTracks((prev) =>
            prev.filter(
              (track) =>
                track.trackPublication.trackSid !== publication.trackSid
            )
          );
          // if (_track.source === Track.Source.ScreenShare) {
          //   setScreenShareTrack(null);
          // }
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
            { sender: participant.identity, content: message },
          ]);
        }
      )
      .on(
        // secreen sharing
        RoomEvent.LocalTrackPublished,
        (publication) => {
          if (publication.track?.source === Track.Source.ScreenShare) {
            setIsScreenSharing(true);

            // console.log('published', publication);
          }
        }
      )
      .on(RoomEvent.LocalTrackUnpublished, (publication) => {
        if (publication.track?.source === Track.Source.ScreenShare) {
          setIsScreenSharing(false);
        }
        // console.log('unpublished', publication);
      });

    try {
      // console.log(APPLICATION_SERVER_URL);

      // Get a token from your application server with the room name and participant name
      const token = await getOpenViduToken(
        APPLICATION_SERVER_URL,
        roomName,
        participantName
      );

      // Connect to the room with the LiveKit URL and the token
      await room.connect(LIVEKIT_URL, token);

      // Publish your camera and microphone
      await room.localParticipant.enableCameraAndMicrophone();
      setLocalTrack(
        room.localParticipant.videoTrackPublications.values().next().value
          .videoTrack
      );
      // localParticipant 요소 확인
      // console.log('room.localParticipant', room.localParticipant);
      // console.log('room.localParticipant.videoTrackPublications', room.localParticipant.videoTrackPublications);
      // console.log('room.localParticipant.videoTrackPublications.values()', room.localParticipant.videoTrackPublications.values());
      // console.log('room.localParticipant.videoTrackPublications.values().next()', room.localParticipant.videoTrackPublications.values().next());
      // console.log('room.localParticipant.videoTrackPublications.values().next().value', room.localParticipant.videoTrackPublications.values().next().value);
      // // videoTrack과 track 둘 모두 작동하는데, 왜 그런 거지???
      // console.log('room.localParticipant.videoTrackPublications.values().next().value.videoTrack', room.localParticipant.videoTrackPublications.values().next().value.videoTrack);
      // console.log('room.localParticipant.videoTrackPublications.values().next().value.track', room.localParticipant.videoTrackPublications.values().next().value.track);
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
      <div id="join">
        <div id="join-dialog">
          <h2>Join a Video Room</h2>
          <form
            onSubmit={(e) => {
              handleJoinRoom();
              e.preventDefault();
            }}
          >
            <div>
              <label htmlFor="participant-name">Participant</label>
              <input
                id="participant-name"
                className="form-control"
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="room-name">Room</label>
              <input
                id="room-name"
                className="form-control"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />
            </div>
            <button
              className="btn btn-lg btn-success"
              type="submit"
              disabled={!roomName || !participantName}
            >
              Join!
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default JoinRoom;
