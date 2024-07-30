import {
  LocalVideoTrack,
  RemoteTrackPublication,
  Room,
} from 'livekit-client';
import './WebRTC.css';
import { useCallback, useState } from 'react';
import JoinRoom from './components/JoinRoom';
import RoomVideoAudioTracks from './components/RoomVideoAudioTracks';
import RoomHeader from './components/RoomHeader';
import RoomChatting from './components/RoomChatting';

type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

type Message = {
  sender: string;
  content: string;
}

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
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenShareTrack, setScreenShareTrack] = useState(null);

  const sendMessage = () => {
    if (inputMessage.trim() && room) {
      const encoder = new TextEncoder();
      const data = encoder.encode(inputMessage);
      room.localParticipant.publishData(data, { reliable: true });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'Me', content: inputMessage },
      ]);
      setInputMessage('');
    }
  };

  const toggleScreenShare = useCallback(async () => {
    if (!room) return;

    try {
      if (isScreenSharing) {
        await room.localParticipant.setScreenShareEnabled(false);
      } else {
        await room.localParticipant.setScreenShareEnabled(true);
      }
    } catch (error) {
      console.error('화면 공유 토글 중 오류 발생:', error);
    }
  }, [room, isScreenSharing]);

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
            <div id="layout-container" className="flex">
              {/* Chatting box 시작 */}
              <RoomChatting 
                room={room}
                messages={messages}
                setMessages={setMessages}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
              />
              {/* 공유화면 시작 */}
              <div className="max-w-7xl mx-auto p-6">
                {/* 비디오 및 화면 공유 표시 */}
                {/* <div id='screen-sharing' className="mb-6">
                  {screenShareTrack && (
                    <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
                      <video
                        // ref={(el) => {
                        //   if (el)
                        //     el.srcObject = new MediaStream([screenShareTrack]);
                        // }}
                        autoPlay
                        className="w-full h-full object-contain"
                        />
                    </div>
                  )}
                </div> */}
                {/* 비디오 및 화면 공유 표시 끗 */}

                {/* 화면 공유 버튼 */}
                <div className="flex justify-center">
                  <button
                    onClick={toggleScreenShare}
                    className={`
                      px-6 py-3 text-lg font-semibold rounded-md transition-colors duration-300
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      ${
                        isScreenSharing
                          ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
                          : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
                      }
                      `}
                  >
                    {isScreenSharing ? '화면 공유 중지' : '화면 공유 시작'}
                  </button>
                </div>
                {/* 화면 공유 버튼 끗 */}
              </div>
              {/* 공유화면 끗 */}
            </div>
          </div>
        </>
      )}
    </>
  );
}

const SharingVideo = () => {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenShareTrack, setScreenShareTrack] = useState(null);
  return (
    <>
      {/* 비디오 및 화면 공유 표시 */}
      <div id="screen-sharing" className="mb-6">
        {screenShareTrack && (
          <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
            <video
              // ref={(el) => {
              //   if (el)
              //     el.srcObject = new MediaStream([screenShareTrack]);
              // }}
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>
      {/* 비디오 및 화면 공유 표시 끗 */}
    </>
  );
};
