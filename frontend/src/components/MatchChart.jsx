import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MatchChart({ value = 0 }) {
  const score = Math.max(0, Math.min(100, Number(value)));
  const data = {
    labels: ["Match", "Gap"],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: ["#2f67f8", "#dbe5ff"],
        borderWidth: 0
      }
    ]
  };

  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="font-heading text-lg font-semibold">Skill Match</p>
      <div className="relative mx-auto mt-4 h-52 w-52">
        <Doughnut
          data={data}
          options={{
            cutout: "74%",
            plugins: { legend: { display: false } }
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-heading text-3xl font-bold">{score}%</p>
          <p className="text-xs text-[var(--muted)]">Career readiness</p>
        </div>
      </div>
    </div>
  );
}
