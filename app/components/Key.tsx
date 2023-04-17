interface Props {
  text: string;
  keysGuessRes: { [key: string]: KeyMatch };
  handleClick: (letter: string) => void;
}

export default function Key({ text, keysGuessRes, handleClick }: Props) {
  const keyBgColor = {
    correct:
      "bg-green-600 active:bg-green-700 dark:active:bg-green-500 text-white",
    wrongSpot:
      "bg-yellow-600 active:bg-yellow-700 dark:active:bg-yellow-500 text-white",
    notExist:
      "dark:bg-zinc-700 dark:active:bg-zinc-600 bg-zinc-500 active:bg-zinc-600 text-white",
  };

  const guessResult = text in keysGuessRes ? keysGuessRes[text] : null;
  return (
    <button
      className={`h-14 w-8 select-none rounded-md text-center text-lg font-bold sm:h-16 sm:w-12  ${
        guessResult
          ? keyBgColor[guessResult]
          : "bg-gray-300 active:bg-gray-400 dark:bg-zinc-500 dark:active:bg-zinc-400"
      }`}
      tabIndex={-1}
      onClick={() => handleClick(text)}
    >
      {text}
    </button>
  );
}
