import dictionary from "@/data/dictionary.json";

export default function validateWord(word: string): boolean {
  return dictionary.includes(word.toLowerCase());
}
