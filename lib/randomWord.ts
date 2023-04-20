import targetWords from "@/data/targetWords.json";

export default function randomWord(): string {
  const index = Math.floor(Math.random() * targetWords.length);
  return targetWords[index];
}
