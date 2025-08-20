import { Chart } from "react-charts"
import { useMoodHistory } from "@/hooks/useMoodHistory"

const MOOD_COLORS = {
  happy: "#FFD700", // Gold
  sad: "#4169E1", // Royal Blue
  anxious: "#FF6347", // Tomato
  calm: "#20B2AA", // Light Sea Green
  energetic: "#FF69B4", // Hot Pink
  tired: "#9370DB", // Medium Purple
  excited: "#FF4500", // Orange Red
  peaceful: "#00CED1", // Dark Turquoise
  stressed: "#DC143C", // Crimson
  content: "#32CD32", // Lime Green
  overwhelmed: "#8B0000", // Dark Red
  optimistic: "#FFA500", // Orange
}

const BREAKDOWN_COLORS = [
  "#FF6B6B", // Coral
  "#4ECDC4", // Turquoise
  "#45B7D1", // Sky Blue
  "#96CEB4", // Mint Green
  "#FFEAA7", // Light Yellow
  "#DDA0DD", // Plum
  "#98D8C8", // Mint
  "#F7DC6F", // Light Gold
  "#BB8FCE", // Light Purple
  "#85C1E9", // Light Blue
]

const MoodHistoryPage = () => {
  const { moodData, breakdownData } = useMoodHistory()

  const moodDistributionChart = (
    <Chart
      data={moodData}
      series={[
        {
          label: "Mood Distribution",
          color: (datum) => MOOD_COLORS[datum.mood],
        },
      ]}
      axes={[
        { primary: true, type: "ordinal", position: "bottom" },
        { type: "linear", position: "left" },
      ]}
    />
  )

  const moodBreakdownChart = (
    <Chart
      data={breakdownData}
      series={[
        {
          label: "Mood Breakdown",
          color: (datum, index) => BREAKDOWN_COLORS[index % BREAKDOWN_COLORS.length],
        },
      ]}
      axes={[
        { primary: true, type: "ordinal", position: "bottom" },
        { type: "linear", position: "left" },
      ]}
    />
  )

  return (
    <div>
      <h1>Mood History</h1>
      <div>{moodDistributionChart}</div>
      <div>{moodBreakdownChart}</div>
    </div>
  )
}

export default MoodHistoryPage
