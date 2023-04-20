interface Props {
  isOpen: boolean;
  message: string;
  yesCallback: () => void;
}

export default function ResultModal({ isOpen, message, yesCallback }: Props) {
  return (
    <div className={`${isOpen && "modal-open"} modal`}>
      <div className="modal-box h-52">
        <h3 className="text-lg font-bold">{message}</h3>
        <p className="py-4">Press Ok to start a new game</p>
        <div className="modal-action">
          <label htmlFor="my-modal" className="btn" onClick={yesCallback}>
            Ok
          </label>
        </div>
      </div>
    </div>
  );
}
