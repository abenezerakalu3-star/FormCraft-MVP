"use client";

import {
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/components/theme-provider";

export interface OverviewSeries {
  date: string;
  users: number;
  forms: number;
  submissions: number;
  views: number;
}

export function shortDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
}

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e"];

export function AdminOverviewCharts({
  series,
  formBreakdown,
}: {
  series: OverviewSeries[];
  formBreakdown: { name: string; value: number }[];
}) {
  const { theme } = useTheme();
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
    <div className="space-y-6">
      {/* Submissions & views trend */}
      <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted">
          <Activity className="h-4 w-4" /> Responses & visitors — last 14 days
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={shortDate}
                tick={{ fontSize: 11, fill: axisColor }}
                tickLine={false}
                axisLine={false}
                minTickGap={28}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: axisColor }} tickLine={false} axisLine={false} />
              <Tooltip labelFormatter={(l) => shortDate(String(l))} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="responses" stroke="#10b981" strokeWidth={2.25} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={2.25} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* New users & forms */}
        <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted">
            <BarChart3 className="h-4 w-4" /> New users & forms — last 14 days
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={shortDate}
                  tick={{ fontSize: 11, fill: axisColor }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={28}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: axisColor }} tickLine={false} axisLine={false} />
                <Tooltip labelFormatter={(l) => shortDate(String(l))} contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="users" name="New users" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={18} />
                <Bar dataKey="forms" name="New forms" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Form status breakdown */}
        <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted">
            <PieChartIcon className="h-4 w-4" /> Forms by status
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-52 w-full">
              {formBreakdown.every((d) => d.value === 0) ? (
                <div className="flex h-full items-center justify-center text-sm text-muted">
                  No forms yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={formBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                      {formBreakdown.map((entry, i) => (
                        <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-sm">
              {formBreakdown.map((entry, i) => (
                <span key={entry.name} className="inline-flex items-center gap-1.5 text-muted">
                  <span className="h-3 w-3 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {entry.name} <b className="text-foreground">{entry.value}</b>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}