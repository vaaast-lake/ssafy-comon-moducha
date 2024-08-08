import { LocalVideoTrack, Room } from 'livekit-client';
import { useState } from 'react';
import JoinRoom from './components/JoinRoom';
import RoomVideoAudioTracks from './components/RoomVideoAudioTracks';
import RoomHeader from './components/RoomHeader';
import RoomChatting from './components/RoomChatting';
import { GroupedTracks, Message } from '../../types/WebRTCType';
import useConfigureUrls from '../../hooks/useConfigureUrls';

export default function WebRTC() {
  const { APPLICATION_SERVER_URL, LIVEKIT_URL } = useConfigureUrls();
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [roomName, setRoomName] = useState('Test Room');
  const [participantName, setParticipantName] = useState(
    // 'Participant' + Math.floor(Math.random() * 100)
    Math.ceil(Math.random() * 8).toString()
  );
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(
    undefined
  );
  const [remoteTracks, setRemoteTracks] = useState<GroupedTracks>({});

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
    setRemoteTracks({});
    setMessages([]);
    setIsScreenSharing(false);
  }


  return (
    <div className='room-wrapper grid grid-cols-12'>
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
        <div id="room" className='lg:col-span-8 lg:col-start-3 col-span-12'>
          <RoomHeader roomName={roomName} />
          <div 
            className='
              room-container 
              grid grid-cols-12
            '
          >
            <RoomVideoAudioTracks
              room={room}
              isScreenSharing={isScreenSharing}
              localTrack={localTrack}
              remoteTracks={remoteTracks}
              participantName={participantName}
              leaveRoom={leaveRoom}
            />
            <RoomChatting
              room={room}
              messages={messages}
              setMessages={setMessages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
}