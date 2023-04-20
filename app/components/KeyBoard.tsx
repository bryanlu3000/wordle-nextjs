import Key from "./Key";

interface Props {
  letterClick: (letter: string) => void;
  backspaceClick: () => void;
  enterClick: () => void;
  inputMatch: GuessMatch;
}

const KEY_ROW_1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const KEY_ROW_2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const KEY_ROW_3 = ["Z", "X", "C", "V", "B", "N", "M"];

export default function KeyBoard({
  letterClick,
  backspaceClick,
  enterClick,
  inputMatch,
}: Props) {
  const KeyRow = (keyRowArr: string[]) => (
    <>
      {keyRowArr.map((item, index) => (
        <Key
          key={index}
          text={item}
          keysGuessRes={inputMatch}
          handleClick={letterClick}
        />
      ))}
    </>
  );

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-1.5 sm:gap-2">
      <div className="flex gap-1 sm:gap-2">{KeyRow(KEY_ROW_1)}</div>

      <div className="flex gap-1 sm:gap-2">{KeyRow(KEY_ROW_2)}</div>

      <div className="flex gap-1 sm:gap-2">
        <button
          className="h-14 w-12 select-none rounded-md bg-gray-300 text-center text-xs font-bold focus:outline-none active:bg-gray-400 dark:bg-zinc-500 dark:active:bg-zinc-400 sm:h-16 sm:w-[75px] sm:text-sm"
          tabIndex={-1}
          onClick={enterClick}
        >
          ENTER
        </button>

        <div className="flex gap-1 sm:gap-2">{KeyRow(KEY_ROW_3)}</div>

        <button
          className="h-14 w-12 select-none rounded-md bg-gray-300 text-center text-lg focus:outline-none active:bg-gray-400 dark:bg-zinc-500 dark:active:bg-zinc-400 sm:h-16 sm:w-[75px] sm:text-xl"
          tabIndex={-1}
          onClick={backspaceClick}
        >
          &#9003;
        </button>
      </div>
    </section>
  );
}
