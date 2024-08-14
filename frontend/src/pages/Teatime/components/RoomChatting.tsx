import React, { useEffect, useRef, useState } from 'react';
import { Room } from 'livekit-client';
import { Message } from '../../../types/WebRTCType';
import { RiMailSendLine } from 'react-icons/ri';
import { FaLeaf } from 'react-icons/fa';
import { LuLeaf } from 'react-icons/lu';
import { BiSolidLeaf } from 'react-icons/bi';

interface RoomChattingProps {
  room: Room;
  messages: Message[] | null;
  userName: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[] | null>>;
}

const RoomChatting = ({ room, messages, userName, setMessages }: RoomChattingProps) => {
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [inputMessage, setInputMessage] = useState<string>('');
  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() && room) {
      const encoder = new TextEncoder();
      const data = encoder.encode(inputMessage);
      room.localParticipant.publishData(data, { reliable: true });
      setMessages((prevMessages) => {

        let newMessages = [];
        if (prevMessages) newMessages = [...prevMessages];
        else newMessages.push({ sender: 'Me', content: inputMessage });

        return newMessages;
      });
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
        h-[calc(100vh-230px)]
      "
    >
      <div
        className="
          chat-header 
          flex justify-center items-center
          row-span-1
          text-3xl text-tea
          flex-wrap
          gap-6
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
        <FaLeaf /> <LuLeaf /> <BiSolidLeaf /> 
      </div>
      <div
        id="chat-message-box"
        className="
          overflow-y-auto
          row-span-9
          bg-gray-200
        "
      >
        <>
          {!messages && (
            <div className='flex justify-center items-center flex-wrap'> 
              <span className='max-w-60 text-center mt-10'>{userName}님, 반갑습니다! <br/><br/> 따뜻한 시간 되세요~!!!</span>  
            </div>
          )}
          {messages && messages.map((msg, index) => (
            <div
              key={index}
              className={`
                px-1 w-full my-2
              `}
            >
              {msg.sender !== 'Me' && (
                <div className="">
                  <strong className="pe-1">{msg.sender}:</strong>
                </div>
              )}{' '}
              <div
                className={`w-full flex ${msg.sender === 'Me' ? 'justify-end pe-1' : 'justify-start ps-3'}`}
              >
                <div className="bg-white m-1 p-2 rounded-xl max-w-52 text-sm">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={messageEndRef}></div>
        </>
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
        <textarea
          className="
            border border-gray-300 rounded-3xl
            h-2/4 w-full 
            mx-2 ps-3 py-3 pe-14
            outline-none
          "
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          wrap='hard'
        />
        <button
          className="
            absolute right-2
            bg-blue-500 hover:bg-blue-600 transition-colors
            text-3xl text-white 
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
