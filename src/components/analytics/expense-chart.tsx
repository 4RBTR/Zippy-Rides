"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Curated color palette for multi-vehicle chart bars
const COLORS = [
  "hsl(250, 75%, 60%)",  // indigo
  "hsl(160, 65%, 50%)",  // teal
  "hsl(35, 90%, 55%)",   // amber
  "hsl(340, 70%, 55%)",  // rose
  "hsl(200, 75%, 55%)",  // sky
  "hsl(280, 65%, 55%)",  // violet
];

interface ExpenseChartProps {
  data: Record<string, string | number>[];
  vehicleNames: string[];
}

export function ExpenseChart({ data, vehicleNames }: ExpenseChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>
          Maintenance costs per vehicle over the last 12 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                className="text-xs fill-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                className="text-xs fill-muted-foreground"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) =>
                  v >= 1000000
                    ? `${(v / 1000000).toFixed(1)}M`
                    : v >= 1000
                    ? `${(v / 1000).toFixed(0)}K`
                    : v.toString()
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                formatter={(value) => [
                  `Rp ${Number(value).toLocaleString()}`,
                  undefined,
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
              />
              {vehicleNames.map((name, i) => (
                <Bar
                  key={name}
                  dataKey={name}
                  fill={COLORS[i % COLORS.length]}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
