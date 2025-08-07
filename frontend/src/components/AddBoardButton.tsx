import PlusIcon from "../icons/PlusIcon";

interface Props {
  onClick: () => void;
  children?: React.ReactNode;
  showLabel?: boolean;
  iconClassName?: string;
  className?: string;
}

function AddBoardButton({
  onClick,
  children,
  showLabel = true,
  iconClassName = "",
  className = "",
}: Props) {
  return (
    <button
      className={`p-2 rounded hover:bg-white/20 transition flex items-center gap-2 ${className}`}
      onClick={onClick}
    >
      {showLabel && <span>{children}</span>}
      <PlusIcon className={iconClassName} />
    </button>
  );
}

export default AddBoardButton;
