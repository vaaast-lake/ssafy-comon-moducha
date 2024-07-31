import { LocalVideoTrack, Room } from 'livekit-client';
import './WebRTC.css';
import { useState } from 'react';
import JoinRoom from './components/JoinRoom';
import RoomVideoAudioTracks from './components/RoomVideoAudioTracks';
import RoomHeader from './components/RoomHeader';
import RoomChatting from './components/RoomChatting';
import RoomSharingButton from './components/RoomSharingButton';
import { Message, TrackInfo } from '../../types/WebRTCType';
import useConfigureUrls from '../../hooks/useConfigureUrls';

export default function WebRTC() {
  const { APPLICATION_SERVER_URL, LIVEKIT_URL } = useConfigureUrls();
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [roomName, setRoomName] = useState('Test Room');
  const [participantName, setParticipantName] = useState(
    // 'Participant' + Math.floor(Math.random() * 100)
    Math.ceil(Math.random() * 7).toString()
  );
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(
    undefined
  );
  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');

  // Screen shairing state
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);

  async function leaveRoom() {
    // Leave the room by calling 'disconnect' method over the Room object
    await room?.disconnect();

    // Reset the state
    setRoom(undefined);
    setLocalTrack(undefined);
    setRemoteTracks([]);
    setMessages([]);
    setIsScreenSharing(false);
  }

  return (
    <>
      {!room ? (
        <JoinRoom
          APPLICATION_SERVER_URL={APPLICATION_SERVER_URL}
          LIVEKIT_URL={LIVEKIT_URL}
          participantName={participantName}
          roomName={roomName}
          setParticipantName={setParticipantName}
          setRoomName={setRoomName}
          setRoom={setRoom}
          setRemoteTracks={setRemoteTracks}
          setMessages={setMessages}
          setIsScreenSharing={setIsScreenSharing}
          setLocalTrack={setLocalTrack}
          leaveRoom={leaveRoom}
        />
      ) : (
        <div id="room">
          <RoomHeader roomName={roomName} leaveRoom={leaveRoom} />
          <RoomVideoAudioTracks
            room={room}
            localTrack={localTrack}
            remoteTracks={remoteTracks}
            participantName={participantName}
          />
          <RoomChatting
            room={room}
            messages={messages}
            setMessages={setMessages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
          />
          {/* 화면 공유 버튼 */}
          <RoomSharingButton room={room} isScreenSharing={isScreenSharing} />
          {/* 화면 공유 버튼 끗 */}
        </div>
      )}
    </>
  );
}