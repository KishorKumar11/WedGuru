import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { BudgetItem } from "../lib/types";

const colors = ["#c8956e", "#7a9e7e", "#8f6fa8", "#d4a373", "#588157", "#6d597a"];

export default function BudgetDonut({ items }: { items: BudgetItem[] }) {
  const grouped = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.actual;
    return acc;
  }, {});
  const data = Object.entries(grouped).map(([name, value]) => ({ name, value }));
  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie innerRadius={56} outerRadius={92} paddingAngle={2} data={data} dataKey="value" nameKey="name">
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${Number(value ?? 0).toFixed(2)}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
