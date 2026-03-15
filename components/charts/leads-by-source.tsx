"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

const SOURCE_LABELS: Record<string, string> = {
  website: "Website",
  chatbot: "Chatbot",
  configurator: "Konfigurator",
  manual: "Manuell",
};

interface Props {
  data: { source: string; count: number }[];
}

export function LeadsBySourceChart({ data }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    name: SOURCE_LABELS[d.source] || d.source,
  }));

  return (
    <Card className="glass-card rounded-2xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Leads nach Quelle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="count"
                nameKey="name"
                paddingAngle={2}
              >
                {chartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#111118",
                  border: "1px solid rgba(124,58,237,0.15)",
                  borderRadius: "8px",
                  color: "#f3f4f6",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
