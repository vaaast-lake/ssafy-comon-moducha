import {
  LocalVideoTrack,
  Room,
} from 'livekit-client';
import './WebRTC.css';
import { useState } from 'react';
import JoinRoom from './components/JoinRoom';
import RoomVideoAudioTracks from './components/RoomVideoAudioTracks';
import RoomHeader from './components/RoomHeader';
import RoomChatting from './components/RoomChatting';
import RoomSharingButton from './components/RoomSharingButton';
import { Message, TrackInfo } from '../../types/WebRTCType';

// For local development, leave these variables empty
// For production, configure them with correct URLs depending on your deployment
const { APPLICATION_SERVER_URL, LIVEKIT_URL } = configureUrls();

function configureUrls() {
  let APPLICATION_SERVER_URL = '';
  let LIVEKIT_URL = '';
  // If APPLICATION_SERVER_URL is not configured, use default value from local development
  if (!APPLICATION_SERVER_URL) {
    if (window.location.hostname === 'localhost') {
      APPLICATION_SERVER_URL = 'http://localhost:6080/';
    } else {
      APPLICATION_SERVER_URL = 'https://' + window.location.hostname + ':6443/';
    }
  }

  // If LIVEKIT_URL is not configured, use default value from local development
  if (!LIVEKIT_URL) {
    if (window.location.hostname === 'localhost') {
      LIVEKIT_URL = 'ws://localhost:7880/';
    } else {
      LIVEKIT_URL = 'wss://' + window.location.hostname + ':7443/';
    }
  }
  return { APPLICATION_SERVER_URL, LIVEKIT_URL };
}



export default function WebRTC() {
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [roomName, setRoomName] = useState('Test Room');
  const [participantName, setParticipantName] = useState(
    'Participant' + Math.floor(Math.random() * 100)
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
        <>
          <div id="room">
            <RoomHeader 
              roomName={roomName}
              leaveRoom={leaveRoom}
            />
            <RoomVideoAudioTracks
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
            <RoomSharingButton 
              room={room}
              isScreenSharing={isScreenSharing}
              />
            {/* 화면 공유 버튼 끗 */}
          </div>
        </>
      )}
    </>
  );
}