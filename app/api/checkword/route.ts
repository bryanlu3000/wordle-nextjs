import targetWordList from "@/data/targetWord.json";
import { NextResponse } from "next/server";

// This target variable has to be defined as a global variable, so that it can save the target value to compare for all incoming requests.
const target: { [key: string]: string } = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guess = searchParams.get("guess")?.toLowerCase();
  const regen = searchParams.get("regen");
  const show = searchParams.get("show");
  const sessionId = searchParams.get("sessionId");

  // console.log(`sessionId is ${sessionId}`);

  const resp: CheckWordRes = {
    isCorrect: false,
    match: [],
    targetWord: null,
  };

  if (!sessionId) {
    return NextResponse.json({ message: "No valid sessionId" });
  }

  if (regen === "true") {
    const index = Math.floor(Math.random() * targetWordList.length);
    target[sessionId] = targetWordList[index];
  }

  if (sessionId in target) {
    if (show === "true") {
      resp.targetWord = target[sessionId];
      return NextResponse.json(resp);
    }

    if (guess) {
      resp.isCorrect = target[sessionId] === guess ? true : false;

      const targetWordArr = target[sessionId].split("");
      const guessArr = guess.split("");

      // the first loop is to find the correct match letter and remove it from both arrays
      targetWordArr.forEach((char, i) => {
        if (char === guessArr[i]) {
          resp.match[i] = "correct";
          targetWordArr[i] = "";
          guessArr[i] = "";
        }
      });

      // the second loop is first to find the wrongSpot letter and remove it from the targetWordArr
      // then the rest letters are notExist
      guessArr.forEach((char, i) => {
        if (char !== "") {
          const targetIndex = targetWordArr.indexOf(char);
          if (targetIndex !== -1) {
            resp.match[i] = "wrongSpot";
            targetWordArr[targetIndex] = "";
          } else {
            resp.match[i] = "notExist";
          }
        }
      });

      // console.log("answer: " + target[sessionId]);
      // console.log("guess: " + guess);
    }
  }
  return NextResponse.json(resp);
}
