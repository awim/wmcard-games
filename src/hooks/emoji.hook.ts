import { useState } from "react";
import {
  smileys,
  sad,
  cool,
  confused,
  love,
  thinking,
  bodyParts,
  dress,
  peopleGestures,
  animalsNature,
  foodDrink,
  travelPlaces,
  activities,
  objects,
  symbols,
  flags,
} from "../emoji";

export type EmojiCategory =
  | "Smileys"
  | "Sad"
  | "Cool"
  | "Confused"
  | "Love"
  | "Thinking"
  | "Body Parts"
  | "Dress"
  | "People & Gestures"
  | "Animals & Nature"
  | "Food & Drink"
  | "Travel & Places"
  | "Activities"
  | "Objects"
  | "Symbols"
  | "Flags";

const emojiMap: Record<EmojiCategory, string[]> = {
  "Smileys": smileys,
  "Sad": sad,
  "Cool": cool,
  "Confused": confused,
  "Love": love,
  "Thinking": thinking,
  "Body Parts": bodyParts,
  "Dress": dress,
  "People & Gestures": peopleGestures,
  "Animals & Nature": animalsNature,
  "Food & Drink": foodDrink,
  "Travel & Places": travelPlaces,
  "Activities": activities,
  "Objects": objects,
  "Symbols": symbols,
  "Flags": flags,
};

export const useEmojiSelector = () => {
  const [selectedCategory, setSelectedCategory] = useState<EmojiCategory>();
  const [availableItems, setAvailableItems] = useState<string[]>([]);

  const selectCategory = (category?: EmojiCategory) => {
    setSelectedCategory(category);
    setAvailableItems(category ? emojiMap[category] : emojiMap["Smileys"]);
  };

  return {
    selectedCategory,
    availableItems,
    selectCategory,
    categories: Object.keys(emojiMap) as EmojiCategory[],
  };
};