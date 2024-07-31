import { Room } from 'livekit-client';
import { useCallback } from 'react';

interface RoomSharingButtonProps {
  room: Room;
  isScreenSharing: boolean;
}

export default function RoomSharingButton({
  room,
  isScreenSharing
}: RoomSharingButtonProps) {

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

  return (
    <>
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
    </>
  );
}

