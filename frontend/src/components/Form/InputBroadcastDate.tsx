import dayJsNow from '../../utils/dayJsNow';
import dayjs from 'dayjs';

type BroadcastProps = {
  broadcastDate: string;
  setBroadcastDate: (date: string) => void;
};

const InputBroadcastDate = ({
  broadcastDate,
  setBroadcastDate,
}: BroadcastProps) => (
  <label className="input input-bordered w-full md:w-1/2 flex items-center gap-2">
    <span className="pr-2 border-r-2">방송</span>
    <input
      className="grow w-4"
      type="datetime-local"
      name="broadcastDate"
      value={broadcastDate}
      onChange={(e) => setBroadcastDate(e.target.value)}
      min={dayJsNow(dayjs().add(1, 'day').toString())}
      step={1}
      required
    />
  </label>
);

export default InputBroadcastDate;
