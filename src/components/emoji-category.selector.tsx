import { EmojiCategory, useEmojiSelector } from "../hooks/emoji.hook";

const EmojiSelector = ({ selectedCategory, selectCategory }: {selectedCategory?: EmojiCategory, selectCategory: (category?: EmojiCategory) => void}) => {
  const { categories } = useEmojiSelector();


  return (
    <div className="w-full flex justify-center mb-2">
      <select
        id="emoji-category"
        value={selectedCategory}
        onChange={(e) => selectCategory(e.target.value as typeof selectedCategory)}
        className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">-- Choose a category --</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EmojiSelector;