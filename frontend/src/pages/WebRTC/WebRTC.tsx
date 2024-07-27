import {
  LocalVideoTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track,
} from 'livekit-client';
import './WebRTC.css';
import { useCallback, useState } from 'react';
import VideoComponent from './components/VideoComponent';
import AudioComponent from './components/AudioComponent';
// import axios from 'axios';

type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

// For local development, leave these variables empty
// For production, configure them with correct URLs depending on your deployment
let APPLICATION_SERVER_URL = '';
let LIVEKIT_URL = '';
configureUrls();

function configureUrls() {
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
}

export default function WebRTC() {
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(
    undefined
  );
  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);

  const [participantName, setParticipantName] = useState(
    'Participant' + Math.floor(Math.random() * 100)
  );
  const [roomName, setRoomName] = useState('Test Room');

  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

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

  async function joinRoom() {
    // Initialize a new Room object
    const room = new Room();
    setRoom(room);

    // Specify the actions when events take place in the room

    room
      .on(
        // On every new Track received...
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
          console.log('subscribed_track', _track);
        }
      )
      .on(
        // On every Track destroyed...
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
      console.log(APPLICATION_SERVER_URL);

      // Get a token from your application server with the room name and participant name
      const token = await getToken(roomName, participantName);

      // Connect to the room with the LiveKit URL and the token
      await room.connect(LIVEKIT_URL, token);

      // Publish your camera and microphone
      await room.localParticipant.enableCameraAndMicrophone();
      setLocalTrack(
        room.localParticipant.videoTrackPublications.values().next().value
          .videoTrack
      );
      // localParticipant 요소 확인
      console.log('room.localParticipant', room.localParticipant);
      console.log('room.localParticipant.videoTrackPublications', room.localParticipant.videoTrackPublications);
      console.log('room.localParticipant.videoTrackPublications.values()', room.localParticipant.videoTrackPublications.values());
      console.log('room.localParticipant.videoTrackPublications.values().next()', room.localParticipant.videoTrackPublications.values().next());
      console.log('room.localParticipant.videoTrackPublications.values().next().value', room.localParticipant.videoTrackPublications.values().next().value);
      // videoTrack과 track 둘 모두 작동하는데, 왜 그런 거지???
      console.log('room.localParticipant.videoTrackPublications.values().next().value.videoTrack', room.localParticipant.videoTrackPublications.values().next().value.videoTrack);
      console.log('room.localParticipant.videoTrackPublications.values().next().value.track', room.localParticipant.videoTrackPublications.values().next().value.track);
      
    } catch (error) {
      console.log(
        'There was an error connecting to the room:',
        (error as Error).message
      );
      await leaveRoom();
    }
  }

  async function leaveRoom() {
    // Leave the room by calling 'disconnect' method over the Room object
    await room?.disconnect();

    // Reset the state
    setRoom(undefined);
    setLocalTrack(undefined);
    setRemoteTracks([]);
  }

  /**
   * --------------------------------------------
   * GETTING A TOKEN FROM YOUR APPLICATION SERVER
   * --------------------------------------------
   * The method below request the creation of a token to
   * your application server. This prevents the need to expose
   * your LiveKit API key and secret to the client side.
   *
   * In this sample code, there is no user control at all. Anybody could
   * access your application server endpoints. In a real production
   * environment, your application server must identify the user to allow
   * access to the endpoints.
   */

  async function getToken(roomName: string, participantName: string) {
    // const data = {
    //   token: 'token',
    // };

    // await axios({
    //   method: 'get',
    //   url: `${APPLICATION_SERVER_URL}/lives/token/1`,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   data: {
    //     roomName: roomName,
    //     participantName: participantName,
    //   },
    // })
    //   .then((res) => {
    //     data.token = res.data.token;
    //   })
    //   .catch((err) => {
    //     new Error(`Failed to get token: ${err.errorMessage}`);
    //   });

    const response = await fetch(APPLICATION_SERVER_URL + 'token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomName: roomName,
        participantName: participantName,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get token: ${error.errorMessage}`);
    }

    const data = await response.json();

    return data.token;
  }

  return (
    <>
      {!room ? (
        <div id="join">
          <div id="join-dialog">
            <h2>Join a Video Room</h2>
            <form
              onSubmit={(e) => {
                joinRoom();
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
      ) : (
        <div id="room">
          <div id="room-header">
            <h2 id="room-title">{roomName}</h2>
            <button
              className="btn btn-danger"
              id="leave-room-button"
              onClick={leaveRoom}
            >
              Leave Room
            </button>
          </div>
          <div id="layout-container" className="flex">
            <div id="video-container" className="">
              {localTrack && (
                <VideoComponent
                  track={localTrack}
                  participantIdentity={participantName}
                  local={true}
                />
              )}
              {remoteTracks.map((remoteTrack) =>
                remoteTrack.trackPublication.kind === 'video' ? (
                  <VideoComponent
                    key={remoteTrack.trackPublication.trackSid}
                    track={remoteTrack.trackPublication.videoTrack!}
                    participantIdentity={remoteTrack.participantIdentity}
                  />
                ) : (
                  <AudioComponent
                    key={remoteTrack.trackPublication.trackSid}
                    track={remoteTrack.trackPublication.audioTrack!}
                  />
                )
              )}
            </div>
            {/* Chatting box 시작 */}
            <div id="chat-container" className="">
              <div
                id="chat-message-box"
                className="h-72 bg-white overflow-y-scroll"
              >
                {messages.map((msg, index) => (
                  <div key={index}>
                    <strong>{msg.sender}:</strong> {msg.content}
                  </div>
                ))}
              </div>
              <div id="chat-footer" className="flex">
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded ml-2 hover:bg-blue-600"
                  onClick={sendMessage}
                >
                  Send
                </button>
              </div>
            </div>
            {/* Chatting Box 끗 */}

            {/* 공유화면 시작 */}
            <div className="max-w-7xl mx-auto p-6">
              {/* 비디오 및 화면 공유 표시 영역 */}
              <div id='screen-sharing' className="mb-6">
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
            </div>
            {/* 공유화면 끗 */}
          </div>
        </div>
      )}
    </>
  );
}
