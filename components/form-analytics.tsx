"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Loader2,
  LineChart as LineChartIcon,
  MousePointerClick,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/components/theme-provider";

export interface AnalyticsData {
  totals: { views: number; submissions: number; completionRate: number };
  daily: { date: string; views: number; submissions: number }[];
  pie: { name: string; value: number }[];
}

function shortDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
}

export default function FormAnalytics({ formId }: { formId: string }) {
  const { theme } = useTheme();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`/api/forms/${formId}/analytics`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load analytics");
        return json;
      })
      .then((json) => active && setData(json))
      .catch((e: Error) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [formId]);

  if (error) {
    return (
      <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
        {error}
      </p>
    );
  }

  if (!data) {
    return (
      <div className="flex h-40 items-center justify-center text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (data.totals.views === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-14 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
          <MousePointerClick className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold">No visitors yet</h3>
        <p className="mt-1 max-w-sm text-sm text-muted">
          Share your form link to get your first visitor. Analytics appear here once people open it.
        </p>
      </div>
    );
  }

  const axisColor = theme === "dark" ? "#8b93a7" : "#6b7280";
  const gridColor = theme === "dark" ? "#2a2f3a" : "#eef0f4";
  const tooltipStyle = {
    background: theme === "dark" ? "#171923" : "#ffffff",
    border: `1px solid ${theme === "dark" ? "#2a2f3a" : "#e5e7eb"}`,
    borderRadius: 12,
    color: theme === "dark" ? "#f3f4f6" : "#111827",
    fontSize: 13,
  };

  return (
    <div className="space-y-8">
      {/* Line chart */}
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
          <LineChartIcon className="h-4 w-4" /> Visitors & responses · last 30 days
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.daily} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={shortDate}
                tick={{ fontSize: 11, fill: axisColor }}
                tickLine={false}
                axisLine={false}
                minTickGap={32}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: axisColor }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                labelFormatter={(label) => shortDate(String(label))}
                contentStyle={tooltipStyle}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="views"
                name="Visitors"
                stroke="#6366f1"
                strokeWidth={2.25}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="submissions"
                name="Responses"
                stroke="#10b981"
                strokeWidth={2.25}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie chart */}
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
          <BarChart3 className="h-4 w-4" /> Visitor breakdown
        </div>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
          <div className="h-56 w-full sm:w-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.pie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {data.pie.map((entry, i) => (
                    <Cell key={entry.name} fill={i === 0 ? "#6366f1" : "#10b981"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted">
              <span className="h-3 w-3 rounded-full bg-indigo-500" /> Visited only
              <span className="ml-auto font-semibold text-foreground">
                {data.pie[0]?.value ?? 0}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <span className="h-3 w-3 rounded-full bg-emerald-500" /> Submitted
              <span className="ml-auto font-semibold text-foreground">
                {data.pie[1]?.value ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}