export default function verifyGuess(
  guess: string,
  targetWord: string
): CheckWordRes {
  // Cannot initialize result only with {}
  const result: CheckWordRes = {
    isCorrect: false,
    match: [],
  };
  const guessStr = guess.toLowerCase();
  result.isCorrect = guessStr === targetWord ? true : false;

  const targetWordArr = targetWord.split("");
  const guessArr = guessStr.split("");

  // the first loop is to find the correct match letter and remove it from both arrays
  targetWordArr.forEach((char, i) => {
    if (char === guessArr[i]) {
      result.match[i] = "correct";
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
        result.match[i] = "wrongSpot";
        targetWordArr[targetIndex] = "";
      } else {
        result.match[i] = "notExist";
      }
    }
  });

  return result;
}
