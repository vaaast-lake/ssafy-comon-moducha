import React from 'react';

interface RoomHeaderProps {
  roomName: string;
  leaveRoom: () => void;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({ roomName, leaveRoom }) => {
  return (
    <>
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
    </>
  );
};

export default RoomHeader;
