interface Props {
  isOpen: boolean;
  message: string;
  yesCallback: () => void;
  noCallback: () => void;
}

export default function ResultModal({
  isOpen,
  message,
  yesCallback,
  noCallback,
}: Props) {
  return (
    <div className={`${isOpen && "modal-open"} modal`}>
      <div className="modal-box h-52">
        <h3 className="text-lg font-bold">{message}</h3>
        <p className="py-4">Do you want to start a new game?</p>
        <div className="modal-action">
          <label htmlFor="my-modal" className="btn" onClick={yesCallback}>
            Yes
          </label>
          <label htmlFor="my-modal" className="btn" onClick={noCallback}>
            No
          </label>
        </div>
      </div>
    </div>
  );
}
