"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: { date: string; leads: number }[];
}

export function LeadsOverTimeChart({ data }: Props) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Leads (30 Tage)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(124,58,237,0.1)"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                tickFormatter={(v) =>
                  new Date(v).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                  })
                }
                interval="preserveStartEnd"
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
                labelFormatter={(v) =>
                  new Date(v).toLocaleDateString("de-DE")
                }
              />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#7c3aed" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
