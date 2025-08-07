import PlusIcon from "../icons/PlusIcon";

interface Props {
  onClick: () => void;
  children: React.ReactNode;
  showLabel?: boolean;
  className?: string; 
}

function AddCardButton({ onClick, children, showLabel = true, className = "" }: Props) {
  return (
    <button
      className={`p-2 rounded-lg hover:bg-gray-600 flex items-center gap-2 ${className}`}
      onClick={onClick}
    >
      <PlusIcon />
        {showLabel && children}
    </button>
  );
}

export default AddCardButton;
