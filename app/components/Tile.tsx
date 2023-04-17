import { useEffect, useState } from "react";

export interface Props {
  text: string;
  guessResult: KeyMatch;
  shake: boolean;
  dance: boolean;
}

const tileBgColor = {
  correct: "bg-green-600 border-green-600",
  wrongSpot: "bg-yellow-600 border-yellow-600",
  notExist: "dark:bg-zinc-700 dark:border-zinc-700 bg-zinc-500 border-zinc-500",
};

export default function Tile({ text, guessResult, shake, dance }: Props) {
  const [changeTileColor, setChangeTileColor] = useState(false);

  useEffect(() => {
    setChangeTileColor(false);
  }, [guessResult]);

  return (
    <div
      className={`box-border grid h-[60px] w-[60px] place-content-center border-2 text-3xl font-bold transition-transform duration-500 sm:h-16 sm:w-16 sm:text-4xl 
      ${shake && "animate-shake"}
      ${dance && "animate-dance"}
      ${!guessResult && "border-zinc-300 dark:border-zinc-700"}
      ${guessResult !== null && !changeTileColor && "rotate-x-90"}
      ${
        guessResult !== null &&
        changeTileColor &&
        `${tileBgColor[guessResult]} text-white`
      }
      `}
      onTransitionEnd={() => {
        setChangeTileColor(true);
      }}
    >
      {text}
    </div>
  );
}
