import React from 'react';
import { Room } from 'livekit-client';
import { Message } from '../../../types/WebRTCType';
import { RiMailSendLine } from 'react-icons/ri';

interface RoomChattingProps {
  room: Room;
  messages: Message[];
  inputMessage: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
}

const RoomChatting = ({
  room,
  messages,
  inputMessage,
  setMessages,
  setInputMessage,
}: RoomChattingProps) => {
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

  return (
    <div
      className="
        chat-container
        grid
        col-span-3
        grid-rows-12
      "
    >
      <div
        className="
          chat-header 
          flex justify-center items-center
          row-span-1
        "
      >
        {/* <div 
          className='
            w-full h-3/5 
            border-b-3 border-solid
            flex items-center justify-center
            text-center text-2xl
            border-b-2
          '
        >
        </div> */}
        CHAT HEADER
      </div>
      <div
        id="chat-message-box"
        className="
          overflow-y-scroll 
          row-span-9
          bg-slate-200
        "
      >
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div
        id="chat-footer"
        className="
          relative
          row-span-2
          flex justify-center items-center 
          w-full 
          pt-3 pb-3
        "
      >
        <input
          type="text"
          className="
            border border-gray-300 
            h-2/4 w-full 
            rounded-3xl
            mx-2
          "
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="
            absolute
            right-2
            bg-blue-500 
            hover:bg-blue-600
            text-2xl text-white 
            px-3 py-2 me-2
            rounded-full 
          "
          onClick={sendMessage}
        >
          <RiMailSendLine />
        </button>
      </div>
    </div>
  );
};

export default RoomChatting;
