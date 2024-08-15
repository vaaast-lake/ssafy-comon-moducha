import roomIcon from '/logo/room-icon.svg';

interface RoomHeaderProps {
  roomName: string;
  onToggleChat: () => void;
}

const RoomHeader = ({ roomName, onToggleChat }: RoomHeaderProps) => {

  return (
    <div
      className="
        room-header
        flex justify-between items-center
        border-b-2
        px-5
      "
    >
      <div
        className="
          header-name
          flex justify-center items-center
        "
      >
        <img src={roomIcon} alt="" className="w-16 h-16 pe-6 border-e-2" />
        <h2 id="room-title" className="ps-6 text-3xl font-bold ">
          {roomName}
        </h2>
      </div>
      <button 
        className='lg:hidden'
        onClick={onToggleChat}
      >
        chatting button
      </button>
    </div>
  );
};

export default RoomHeader;
