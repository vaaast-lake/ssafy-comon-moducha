import React from 'react';
import { Room } from 'livekit-client';
import { Message } from '../../../types/WebRTCType';

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
    <div id="chat-container" className="">
      <div id="chat-message-box" className="h-72 bg-white overflow-y-scroll">
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
  );
};

export default RoomChatting;
