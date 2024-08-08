import dayJsNow from '../../utils/dayJsNow';

type DateInputProps = {
  pickedDate: string;
  setPickedDate: (date: string) => void;
};

const InputDate = ({ pickedDate, setPickedDate }: DateInputProps) => (
  <label className="input input-bordered w-full md:w-1/2 flex items-center gap-2">
    <span className="pr-2 border-r-2">마감</span>
    <input
      className="grow w-4"
      type="datetime-local"
      name="endDate"
      value={pickedDate}
      onChange={(e) => setPickedDate(e.target.value)}
      min={dayJsNow()}
      step={1}
      required
    />
  </label>
);
export default InputDate;
