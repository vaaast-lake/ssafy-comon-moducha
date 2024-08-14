import roomIcon from '/logo/room-icon.svg';

interface RoomHeaderProps {
  roomName: string;
}

const RoomHeader = ({ roomName }: RoomHeaderProps) => {
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
        <img src={roomIcon} alt="" className="w-20 h-28 pe-6 border-e-2 py-5" />
        <h2 id="room-title" className="ps-6 text-4xl font-bold">
          {roomName}
        </h2>
      </div>
    </div>
  );
};

export default RoomHeader;
