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
          setRemoteTracks((prev) => [
            ...prev,
            {
              trackPublication: publication,
              participantIdentity: participant.identity,
            },
          ]);
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
        }
      )
      .on(RoomEvent.LocalTrackUnpublished, (publication) => {
        if (publication.track?.source === Track.Source.ScreenShare) {
          setIsScreenSharing(false);
        }
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
