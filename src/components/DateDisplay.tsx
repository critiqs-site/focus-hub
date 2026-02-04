import { addDays, format, isSameDay } from "date-fns";

const DateDisplay = () => {
  const today = new Date();

  // Generate 7 days: 3 before, today, 3 after
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 3));

  return (
    <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center justify-center gap-2 md:gap-4">
        {days.map((date, index) => {
          const isToday = isSameDay(date, today);
          return (
            <button
              key={date.toISOString()}
              className={`flex flex-col items-center justify-center min-w-[50px] md:min-w-[60px] py-3 px-2 rounded-xl transition-all duration-300 ${
                isToday
                  ? "bg-primary text-primary-foreground orange-glow scale-110"
                  : "glass-card hover:border-primary/40 hover:scale-105"
              }`}
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <span className={`text-xl md:text-2xl font-bold ${isToday ? "" : "text-foreground"}`}>
                {format(date, "d")}
              </span>
              <span className={`text-xs uppercase tracking-wide ${isToday ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {format(date, "EEE")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateDisplay;
