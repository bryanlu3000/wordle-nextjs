interface CheckWordRes {
  isCorrect: boolean;
  match: ("correct" | "wrongSpot" | "notExist")[];
}

type KeyMatch = "correct" | "wrongSpot" | "notExist" | null;

type GuessMatch = { [key: string]: KeyMatch };
