interface Prop {
  children: React.ReactNode;
  value: string;
  toggleOption: string;
  onClick: () => void;
}

const TabToggleButton = ({ children, value, toggleOption, onClick }: Prop) => {
  return (
    <button
      className={
        'hover:bg-teabg rounded-2xl border-2 px-5 py-2.5 font-semibold text-lg ' +
        (value === toggleOption
          ? 'bg-teabg text-tea border-teabg'
          : 'text-disabled')
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default TabToggleButton;
