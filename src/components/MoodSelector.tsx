import type { MoodType } from "@/types/todo";

interface MoodOption {
  type: MoodType;
  emoji: string;
  label: string;
}

const moodOptions: MoodOption[] = [
  { type: "super_happy", emoji: "😄", label: "Super Happy" },
  { type: "happy", emoji: "🙂", label: "Happy" },
  { type: "neutral", emoji: "😐", label: "Neutral" },
  { type: "sad", emoji: "😢", label: "Sad" },
  { type: "depressed", emoji: "😞", label: "Depressed" },
];

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onSelect: (mood: MoodType) => void;
}

const MoodSelector = ({ selectedMood, onSelect }: MoodSelectorProps) => {
  return (
    <div className="flex items-center justify-center gap-3">
      {moodOptions.map((mood) => (
        <button
          key={mood.type}
          onClick={() => onSelect(mood.type)}
          className={`
            relative p-3 rounded-xl transition-all duration-300
            ${selectedMood === mood.type
              ? "bg-primary/20 scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background"
              : "bg-secondary/50 hover:bg-secondary hover:scale-105"
            }
          `}
          title={mood.label}
        >
          <span className="text-2xl">{mood.emoji}</span>
        </button>
      ))}
    </div>
  );
};

export const getMoodEmoji = (mood: MoodType): string => {
  const option = moodOptions.find(m => m.type === mood);
  return option?.emoji || "😐";
};

export const getMoodLabel = (mood: MoodType): string => {
  const option = moodOptions.find(m => m.type === mood);
  return option?.label || "Neutral";
};

export default MoodSelector;
