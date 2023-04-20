"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import toast from "react-hot-toast";
import KeyBoard from "./components/KeyBoard";
import Tile from "./components/Tile";
import ResultModal from "./components/ResultModal";
import validateWord from "@/lib/validateWord";
import randomWord from "@/lib/randomWord";
import verifyGuess from "@/lib/verifyGuess";
import { useLocalStorage } from "./hooks/useLocalStorage";

type Tile = {
  text: string;
  guessResult: KeyMatch;
};

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  const arr2D: Tile[][] = new Array(6);
  for (let i = 0; i < arr2D.length; i++) {
    arr2D[i] = new Array(5).fill({ text: "", guessResult: null });
  }

  const [tiles, setTiles] = useLocalStorage<Tile[][]>("tiles", arr2D);
  const [curRowIndex, setCurRowIndex] = useLocalStorage<number>(
    "curRowIndex",
    0
  );
  const [curColIndex, setCurColIndex] = useLocalStorage<number>(
    "curColIndex",
    0
  );
  const [inputMatch, setInputMatch] = useLocalStorage<GuessMatch>(
    "inputMatch",
    {}
  );
  const [targetWord, setTargetWord] = useLocalStorage<string>("targetWord", "");
  const [isNewGame, setIsNewGame] = useLocalStorage<boolean>("isNewGame", true);
  const [isOpenModal, setIsOpenModal] = useLocalStorage<boolean>(
    "isOpenModal",
    false
  );
  const [resultMsg, setResultMsg] = useLocalStorage<string>("resultMsg", "");

  const [shakeRow, setShakeRow] = useState(false);
  const [isAllowInput, setIsAllowInput] = useState(true);
  const [danceTile, setDanceTile] = useState<boolean[]>(
    new Array(5).fill(false)
  );

  // set focus to main element to receive keyboard event
  useEffect(() => {
    mainRef.current?.focus();
  }, []);

  // Cannot use useEffect here, or the targetWord will change on window refresh
  useMemo(() => {
    if (isNewGame) {
      setTargetWord(randomWord());
    }
  }, [isNewGame]);

  const resetGame = () => {
    setTiles(arr2D);
    setCurRowIndex(0);
    setCurColIndex(0);
    setInputMatch({});
    setDanceTile(new Array(5).fill(false));
    setIsNewGame(true);
    setIsOpenModal(false);
    setIsAllowInput(true);
    setResultMsg("");
  };

  const shakeOn = () => {
    setShakeRow(true);
  };

  const shakeOff = () => {
    setTimeout(() => {
      setShakeRow(false);
      setIsAllowInput(true);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key.match(/^[a-zA-Z]$/)) {
      letterClick(e.key.toUpperCase());
    }

    if (e.key === "Enter") {
      enterClick();
    }

    if (e.key === "Backspace") {
      backspaceClick();
    }
  };

  const letterClick = (letter: string) => {
    if (isAllowInput && curColIndex < 5) {
      setTiles((prev) =>
        prev.map((row, i) =>
          i === curRowIndex
            ? row.map((item, j) =>
                j === curColIndex ? { ...item, text: letter } : item
              )
            : row
        )
      );
      setCurColIndex((prev) => prev + 1);
    }
  };

  const backspaceClick = () => {
    if (isAllowInput && curColIndex > 0) {
      setTiles((prev) =>
        prev.map((row, i) =>
          i === curRowIndex
            ? row.map((item, j) =>
                j === curColIndex - 1 ? { ...item, text: "" } : item
              )
            : row
        )
      );
      setCurColIndex((prev) => prev - 1);
    }
  };

  const enterClick = () => {
    if (isAllowInput) {
      setIsAllowInput(false);

      if (curColIndex < 5) {
        // Not enough letters
        shakeOn();
        // After 800ms, set the shake toggle back to false for the next time use
        shakeOff();
        toast.error("Not enough letters!", {
          duration: 1000,
        });
      } else {
        // convert to a guess string
        const guess = tiles[curRowIndex].reduce(
          (res: string, item) => res + item.text,
          ""
        );

        const isValidWord = validateWord(guess);

        if (!isValidWord) {
          shakeOn();
          shakeOff();
          toast.error("Not in word list!", {
            duration: 1000,
          });
        } else {
          // console.log(targetWord);
          // console.log(guess);

          const checkResult: CheckWordRes = verifyGuess(guess, targetWord);
          const { match } = checkResult;

          // use guessResult to trigger tile flipping and color change
          for (let index = 0; index < 5; index++) {
            setTimeout(() => {
              setTiles((prev) =>
                prev.map((row, i) =>
                  i === curRowIndex
                    ? row.map((item, j) =>
                        j === index ? { ...item, guessResult: match[j] } : item
                      )
                    : row
                )
              );
            }, 200 * index);
          }

          // After tiles flipping, set the keyboard key color
          // Key in keyboard will only change state to "correct" in case that previous state is "notExist" or "wrongSpot"
          // Cannot read inputMatch right after setInputMatch
          setTimeout(() => {
            setInputMatch((prev) => {
              guess.split("").forEach((letter, i) => {
                if (!(letter in prev)) {
                  prev[letter] = match[i];
                } else if (
                  (prev[letter] === "notExist" ||
                    prev[letter] === "wrongSpot") &&
                  match[i] === "correct"
                ) {
                  prev[letter] = "correct";
                }
              });
              // inputMatch is an object, its referense is transferred as the argument.
              // If only return prev, the inputMatch reference does not change, which will not trigger the useEffect in useLocalStorage to write value into localStorage
              return { ...prev };
            });
          }, 1800);

          // After tiles flipping, check if the guess is correct.
          setTimeout(async () => {
            if (checkResult.isCorrect) {
              toast.success("Success! Great Job!", {
                duration: 2000,
                icon: "🎉",
              });

              // Tile dance
              danceTile.forEach((item, index) => {
                setTimeout(() => {
                  setDanceTile((prev) =>
                    prev.map((tile, i) => (i === index ? true : tile))
                  );
                }, index * 100);
              });

              // After tiles dance, show modal.
              setTimeout(() => {
                setResultMsg("Congratulations!");
                setIsOpenModal(true);
              }, 1000);
            } else {
              if (curRowIndex < 5) {
                setIsNewGame(false);
                setCurRowIndex((prev) => prev + 1);
                setCurColIndex(0);
                setIsAllowInput(true);
              } else {
                setResultMsg(`The answer is "${targetWord}"`);
                setIsOpenModal(true);
              }
            }
          }, 2000);
        }
      }
    }
  };

  return (
    <main
      ref={mainRef}
      className="mx-auto flex h-screen flex-col items-center justify-around focus:outline-none"
      tabIndex={-1}
      onKeyDown={handleKeyPress}
    >
      <h1 className="text-2xl font-bold sm:p-4 sm:text-5xl">Wordle</h1>

      <ResultModal
        isOpen={isOpenModal}
        message={resultMsg}
        yesCallback={resetGame}
      />

      <section className="grid grid-cols-5 place-content-center place-items-center gap-1.5 sm:gap-2">
        {tiles.map((row, rowIndex) =>
          row.map((item, colIndex) => (
            <Tile
              key={rowIndex * 10 + colIndex}
              text={item.text}
              guessResult={item.guessResult}
              shake={curRowIndex === rowIndex ? shakeRow : false}
              dance={curRowIndex === rowIndex ? danceTile[colIndex] : false}
            />
          ))
        )}
      </section>

      <KeyBoard
        letterClick={letterClick}
        backspaceClick={backspaceClick}
        enterClick={enterClick}
        inputMatch={inputMatch}
      />
    </main>
  );
}
