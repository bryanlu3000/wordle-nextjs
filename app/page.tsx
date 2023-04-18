"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import KeyBoard from "./components/KeyBoard";
import Tile from "./components/Tile";
import ResultModal from "./components/ResultModal";
import validateWord from "@/lib/validateWord";
import { useLocalStorage } from "./hooks/useLocalStorage";

interface Tile {
  text: string;
  guessResult: KeyMatch;
}

const URL = "/api/checkword";
// const GRID_ROWS = 6;
// const GRID_COLS = 5;

export default function Home() {
  const initialSessionId = Math.floor(Math.random() * 1000000);
  const [sessionId, setSessionId] = useLocalStorage<string>(
    "sessionId",
    initialSessionId.toString()
  );
  // console.log(`sessionId is ${sessionId}`);

  const mainRef = useRef<HTMLElement>(null);

  const arr2D: Tile[][] = new Array(6);

  for (let i = 0; i < arr2D.length; i++) {
    arr2D[i] = new Array(5).fill({ text: "", guessResult: null });
  }

  const [tiles, setTiles] = useState(arr2D);
  const [curRowIndex, setCurRowIndex] = useState(0);
  const [curColIndex, setCurColIndex] = useState(0);
  const [inputMatch, setInputMatch] = useState<{ [key: string]: KeyMatch }>({});
  const [regen, setRegen] = useState("true");

  const [shakeRow, setShakeRow] = useState(false);
  const [danceTile, setDanceTile] = useState<boolean[]>(
    new Array(5).fill(false)
  );
  const [isGameOver, setIsGameOver] = useState(false);
  const [resultMsg, setResultMsg] = useState("");
  const [isAllowInput, setIsAllowInput] = useState(true);

  // set focus to main element to receive keyboard event
  useEffect(() => {
    mainRef.current?.focus();
  }, []);

  const resetGame = () => {
    setTiles(arr2D);
    setCurRowIndex(0);
    setCurColIndex(0);
    setInputMatch({});
    setDanceTile(new Array(5).fill(false));
    setRegen("true");
    setIsGameOver(false);
    setIsAllowInput(true);
  };

  const stopGame = () => {
    // setIsAllowInput(false);
    setIsGameOver(false);
  };

  const shakeOn = () => {
    setShakeRow(true);
    setIsAllowInput(false);
  };

  const shakeOff = () => {
    setTimeout(() => {
      setShakeRow(false);
      setIsAllowInput(true);
    }, 800);
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

  const enterClick = async () => {
    if (isAllowInput) {
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
          const result = await fetch(
            `${URL}?sessionId=${sessionId}&guess=${guess}&regen=${regen}`
          );
          if (result.ok) {
            const checkResult: CheckWordRes = await result.json();

            // match: ("correct" | "wrongSpot" | "notExist")[];
            const { match } = checkResult;

            // During tiles flipping, disable input new letters.
            setIsAllowInput(false);

            // use guessResult to trigger tile flipping and color change
            for (let index = 0; index < 5; index++) {
              setTimeout(() => {
                setTiles((prev) =>
                  prev.map((row, i) =>
                    i === curRowIndex
                      ? row.map((item, j) =>
                          j === index
                            ? { ...item, guessResult: match[j] }
                            : item
                        )
                      : row
                  )
                );
              }, 250 * index);
            }

            // After tiles flipping, enable input new letters.
            setTimeout(() => {
              setIsAllowInput(true);
            }, 2000);

            // After tiles flipping, set the keyboard key color
            // inputMatch is for keyboard key state color
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
                return prev;
              });
            }, 2000);

            // After tiles flipping, check if the guess is correct.
            setTimeout(async () => {
              if (checkResult.isCorrect) {
                setIsAllowInput(false);

                toast.success("Success! Great Job!", {
                  duration: 2000,
                  icon: "🎉",
                });

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
                  setIsGameOver(true);
                }, 1000);
              } else {
                if (regen === "true") setRegen("false");

                if (curRowIndex < 5) {
                  setCurRowIndex((prev) => prev + 1);
                  setCurColIndex(0);
                } else {
                  setIsAllowInput(false);

                  const result = await fetch(
                    `${URL}?sessionId=${sessionId}&show=true`
                  );
                  const checkResult: CheckWordRes = await result.json();

                  const { targetWord } = checkResult;
                  setResultMsg(`The answer is "${targetWord}"`);
                  setIsGameOver(true);
                }
              }
            }, 2000);
          }
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
        isOpen={isGameOver}
        message={resultMsg}
        yesCallback={resetGame}
        noCallback={stopGame}
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
