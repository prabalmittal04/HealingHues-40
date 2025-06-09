import { getUserMoodEntries } from "./getUserMoodEntries";

const moodScoreMap: Record<string, number> = {
  Happy: 4,
  Calm: 3,
  Neutral: 2,
  Sad: 1,
  Angry: 0,
  unknown: 2,
};

export const getMoodStatistics = async (userId: string) => {
  const entries = await getUserMoodEntries(userId);
  const moodCounts: Record<string, number> = {};
  let totalMoodScore = 0;

  const entryDatesSet = new Set<string>();

  entries.forEach((entry) => {
    const mood = entry.mood || "unknown";
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    totalMoodScore += moodScoreMap[mood] ?? 2;

    if (entry.date?.toDate) {
      const dateStr = entry.date.toDate().toISOString().substring(0, 10);
      entryDatesSet.add(dateStr);
    }
  });

  let mostCommonMood = "Calm";
  let maxCount = 0;
  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonMood = mood;
    }
  });

  const averageMood = entries.length > 0 ? totalMoodScore / entries.length : 0;

  const sortedDates = Array.from(entryDatesSet).sort((a, b) => (a < b ? 1 : -1));
  let streakDays = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i]);
    date.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === streakDays) {
      streakDays++;
    } else if (diffDays > streakDays) {
      break;
    }
  }

  const last7DaysTrend: { date: string; moodValue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().substring(0, 10);

    const dayEntries = entries.filter((e) => {
      const eDate = e.date?.toDate?.().toISOString().substring(0, 10);
      return eDate === dateStr;
    });

    let dayMoodScore = 0;
    if (dayEntries.length > 0) {
      const dayTotal = dayEntries.reduce((sum, e) => {
        const mood = e.mood || "unknown";
        return sum + (moodScoreMap[mood] ?? 2);
      }, 0);
      dayMoodScore = dayTotal / dayEntries.length;
    }

    last7DaysTrend.push({ date: dateStr, moodValue: dayMoodScore });
  }

  return {
    totalEntries: entries.length,
    moodCounts,
    averageMood,
    mostCommonMood,
    streakDays,
    last7DaysTrend,
  };
};
