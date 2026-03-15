"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_LABELS: Record<string, string> = {
  new: "Neu",
  contacted: "Kontaktiert",
  qualified: "Qualifiziert",
  proposal: "Angebot",
  won: "Gewonnen",
  lost: "Verloren",
};

interface Props {
  data: { status: string; count: number }[];
}

export function LeadStatusDistributionChart({ data }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    name: STATUS_LABELS[d.status] || d.status,
  }));

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Lead-Status-Verteilung
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(124,58,237,0.1)"
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#111118",
                  border: "1px solid rgba(124,58,237,0.15)",
                  borderRadius: "8px",
                  color: "#f3f4f6",
                }}
              />
              <Bar
                dataKey="count"
                fill="#7c3aed"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
