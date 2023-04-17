interface CheckWordRes {
  isCorrect: boolean;
  match: ("correct" | "wrongSpot" | "notExist")[];
  targetWord: string | null;
}

type KeyMatch = "correct" | "wrongSpot" | "notExist" | null;
