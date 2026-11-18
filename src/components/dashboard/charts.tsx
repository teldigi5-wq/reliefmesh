"use client";

import { useId, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const CHART_TEXT = "var(--ops-muted)";
const CHART_GRID = "var(--ops-grid)";
const CATEGORY_COLORS = [
  "#14c8d6", "#4d98eb", "#a18bf3", "#efa75a",
  "#5db9a6", "#d17ba9", "#7d98e8", "#a0b7c6",
];

function ChartSummary({ children }: { children: React.ReactNode }) {
  return <p className="ops-chart-summary">{children}</p>;
}

export function CategoryBarChart({
  data,
}: {
  data: { label: string; count: number }[];
}) {
  const sorted = useMemo(() => [...data].sort((a, b) => b.count - a.count), [data]);
  if (sorted.length === 0) {
    return <p className="ops-chart-empty">No category data available yet.</p>;
  }
  const max = Math.max(1, ...sorted.map(row => row.count));
  const total = sorted.reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="ops-compare-chart" role="group" aria-label="Incident counts by category">
      <ChartSummary>{total.toLocaleString()} incidents across {sorted.length} categories</ChartSummary>
      <div className="ops-compare-list">
        {sorted.map((row, index) => (
          <div className="ops-compare-row" key={row.label}>
            <div className="ops-compare-row-header">
              <span className="ops-compare-label" title={row.label}>{row.label}</span>
              <span className="ops-compare-count">{row.count.toLocaleString()}</span>
            </div>
            <div
              className="ops-compare-track"
              role="img"
              aria-label={row.label + ": " + row.count + " incidents"}
            >
              <div className="ops-compare-fill"
                style={{
                  width: (row.count / max * 100) + "%",
                  backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SeverityBarChart({
  data,
}: {
  data: { label: string; count: number; color: string }[];
}) {
  const total = data.reduce((sum, row) => sum + row.count, 0);
  const max = Math.max(1, ...data.map(row => row.count));

  return (
    <div className="ops-compare-chart" role="group" aria-label="Incident counts by severity">
      <ChartSummary>{total.toLocaleString()} incident records · By severity level</ChartSummary>
      <div className="ops-severity-list">
        {data.map(row => {
          const percent = total > 0 ? Math.round((row.count / total) * 100) : 0;
          return (
            <div className="ops-severity-row" key={row.label}>
              <div className="ops-compare-row-header">
                <span className="ops-severity-label">
                  <span className="ops-severity-dot" style={{ backgroundColor: row.color }} />
                  {row.label}
                </span>
                <span className="ops-severity-value">
                  <strong>{row.count.toLocaleString()}</strong>
                  <small>{percent}%</small>
                </span>
              </div>
              <div className="ops-severity-track" role="img"
                aria-label={row.label + ": " + row.count + " incidents, " + percent + " percent"}>
                <div className="ops-severity-fill"
                  style={{ width: (row.count / max * 100) + "%", backgroundColor: row.color }} />
              </div>
            </div>
          );
        })}
      </div>
      <p className="ops-chart-caption">Bar lengths compare counts; percentages show share of all incidents.</p>
    </div>
  );
}

export function IncidentsOverTimeChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const [days, setDays] = useState<7 | 14>(14);
  const graphId = useId().replace(/:/g, "");
  const gradientId = "ops-trend-" + graphId;
  const visible = data.slice(-days);
  const total = visible.reduce((sum, day) => sum + day.count, 0);
  const peak = visible.reduce((n, day) => Math.max(n, day.count), 0);

  return (
    <div className="ops-trend-graph">
      <div className="ops-trend-head">
        <ChartSummary>{total.toLocaleString()} reports · Peak {peak.toLocaleString()} in one day</ChartSummary>
        <div className="ops-range-control" role="group" aria-label="Time range">
          <button type="button" aria-pressed={days === 7}
            className={days === 7 ? "is-selected" : ""}
            onClick={() => setDays(7)}>7 days</button>
          <button type="button" aria-pressed={days === 14}
            className={days === 14 ? "is-selected" : ""}
            onClick={() => setDays(14)}>14 days</button>
        </div>
      </div>
      {visible.length === 0 ? (
        <p className="ops-chart-empty">No trend data available.</p>
      ) : (
        <div className="ops-chart ops-chart-trend">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visible} margin={{ top: 17, right: 17, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#11cbd7" stopOpacity={0.23} />
                  <stop offset="100%" stopColor="#11cbd7" stopOpacity={0.012} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 7" stroke={CHART_GRID} />
              <XAxis dataKey="date" axisLine={false} tickLine={false}
                tick={{ fill: CHART_TEXT, fontSize: 11 }} minTickGap={25}
                tickMargin={13} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false}
                domain={[0, "auto"]} tick={{ fill: CHART_TEXT, fontSize: 11 }}
                tickMargin={8} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--ops-card)",
                  borderColor: "var(--ops-border)",
                  borderRadius: 12,
                  boxShadow: "0 15px 35px rgba(0,0,0,.2)",
                  color: "var(--ops-text)",
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--ops-text)", fontWeight: 700, marginBottom: 5 }}
                itemStyle={{ color: "var(--ops-accent)" }}
              />
              <Area type="monotone" dataKey="count" name="New incident reports"
                stroke="#13cbd8" strokeWidth={2.7}
                fill={"url(#" + gradientId + ")"}
                dot={false}
                activeDot={{ r: 5, fill: "#13cbd8", stroke: "#092436", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="ops-graph-legend"><span className="ops-legend-swatch" /> New incident reports per day</div>
    </div>
  );
}
