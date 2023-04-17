interface Props {
  text: string;
  keysGuessRes: { [key: string]: KeyMatch };
  handleClick: (letter: string) => void;
}

export default function Key({ text, keysGuessRes, handleClick }: Props) {
  const keyBgColor = {
    correct:
      "bg-green-600 sm:hover:bg-green-500 sm:active:bg-green-400 text-white",
    wrongSpot:
      "bg-yellow-600 sm:hover:bg-yellow-500 sm:active:bg-yellow-400 text-white",
    notExist:
      "dark:bg-zinc-700 sm:dark:hover:bg-zinc-600 sm:dark:active:bg-zinc-500 bg-zinc-500 sm:hover:bg-zinc-400 sm:active:bg-zinc-300 text-white",
  };

  const guessResult = text in keysGuessRes ? keysGuessRes[text] : null;
  return (
    <button
      className={`h-14 w-8 rounded-md text-center text-lg font-bold sm:h-16 sm:w-12  ${
        guessResult
          ? keyBgColor[guessResult]
          : "bg-gray-300 dark:bg-zinc-500 dark:hover:bg-zinc-400 dark:active:bg-zinc-300 sm:hover:bg-slate-300 sm:active:bg-slate-200"
      }`}
      onClick={() => handleClick(text)}
    >
      {text}
    </button>
  );
}
