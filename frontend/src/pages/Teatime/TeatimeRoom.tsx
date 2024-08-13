import { useLocation } from 'react-router-dom';
import { useRoom } from '../../hooks/useRoom';
import useAuthStore from '../../stores/authStore';
import { useEffect } from 'react';
import RoomHeader from './components/RoomHeader';
import RoomVideoAudioTracks from './components/RoomVideoAudioTracks';
import RoomChatting from './components/RoomChatting';

export default function TeatimeRoom() {
  const { state: {
    roomName,
    boardId,
    boardType
  }} = useLocation();
  const { userName, teatimeToken } = useAuthStore((state) => ({
    userName: state.currentUsername,
    teatimeToken: state.teatimeToken,
  }));
  const {
    joinRoom,
    room,
    isScreenSharing,
    localTrack,
    remoteTracks,
    messages,
    setMessages,
    leaveRoom,
  } = useRoom({
    roomName,
    participantName: userName,
    teatimeToken,
    boardId
  });

  useEffect(() => {
    joinRoom();
  }, []);

  const apiData = {
    roomName,
    boardId,
    boardType
  }

  return (
    <div className="room-wrapper grid grid-cols-12">
      {room && (
        <div id="room" className="lg:col-span-8 lg:col-start-3 col-span-12">
          <RoomHeader roomName={roomName} />
          <div
            className="
              room-container 
              grid grid-cols-12
            "
          >
            <RoomVideoAudioTracks
              room={room}
              isScreenSharing={isScreenSharing}
              localTrack={localTrack}
              remoteTracks={remoteTracks}
              participantName={userName}
              leaveRoom={leaveRoom}
              apiData={apiData}
            />
            <RoomChatting
              room={room}
              messages={messages}
              setMessages={setMessages}
            />
          </div>
        </div>
      )}
    </div>
  );
}
