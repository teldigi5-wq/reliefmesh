"use client";
import { ResponsiveContainer, BarChart, Bar, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
const LABEL = "var(--ops-muted)";
const GRID = "var(--ops-grid)";
const tooltipStyle = { borderRadius: 12, background: "var(--ops-card)", color: "var(--ops-text)", border: "1px solid var(--ops-border)", boxShadow: "0 10px 35px rgba(0,0,0,.14)", fontSize: 12 };
const colors = ["#15d5dc", "#378fee", "#a785ff", "#f6ac5b", "#50baaa", "#db80bd", "#738df6", "#a8bfce"];
export function CategoryBarChart({ data }: { data: { label: string; count: number }[] }) {
 if (data.length === 0) return <p className="ops-chart-empty">No category data available.</p>;
 const display = [...data].sort((a,b) => b.count - a.count);
 return (
 <div className="ops-chart" style={{ height: Math.max(270, display.length * 40 + 48) }}>
   <ResponsiveContainer width="100%" height="100%">
     <BarChart data={display} layout="vertical" margin={{ top: 5, right: 18, left: 0, bottom: 5 }} barCategoryGap={12}>
       <CartesianGrid horizontal={false} strokeDasharray="3 7" stroke={GRID} />
       <XAxis type="number" allowDecimals={false} tick={{ fill: LABEL, fontSize: 11 }} axisLine={false} tickLine={false} />
       <YAxis type="category" dataKey="label" width={133} tick={{ fill: LABEL, fontSize: 11 }}
         tickFormatter={(value: string) => value.length > 19 ? value.slice(0, 18) + "…" : value}
         axisLine={false} tickLine={false} />
       <Tooltip cursor={{ fill: "rgba(120,170,200,.08)" }} contentStyle={tooltipStyle} />
       <Bar dataKey="count" name="Incidents" radius={[0, 6, 6, 0]} maxBarSize={19}>
         {display.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
       </Bar>
     </BarChart>
   </ResponsiveContainer>
 </div>);
}
export function SeverityBarChart({ data }: { data: { label: string; count: number; color: string }[] }) {
 return (
 <div className="ops-chart" style={{ height: 300 }}>
   <ResponsiveContainer width="100%" height="100%">
     <BarChart data={data} margin={{ top: 10, right: 8, left: -24, bottom: 5 }} barCategoryGap="36%">
       <CartesianGrid vertical={false} strokeDasharray="3 7" stroke={GRID} />
       <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: LABEL, fontSize: 11 }} />
       <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: LABEL, fontSize: 11 }} />
       <Tooltip cursor={{ fill: "rgba(120,170,200,.08)" }} contentStyle={tooltipStyle} />
       <Bar dataKey="count" name="Incidents" radius={[7, 7, 0, 0]} maxBarSize={57}>
         {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
       </Bar>
     </BarChart>
   </ResponsiveContainer>
 </div>);
}
export function IncidentsOverTimeChart({ data }: { data: { date: string; count: number }[] }) {
 return (
 <div className="ops-chart" style={{ height: 286 }}>
   <ResponsiveContainer width="100%" height="100%">
     <AreaChart data={data} margin={{ top: 14, right: 10, left: -22, bottom: 0 }}>
       <defs><linearGradient id="opsTrendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#15d5dc" stopOpacity={0.26} /><stop offset="96%" stopColor="#15d5dc" stopOpacity={0} /></linearGradient></defs>
       <CartesianGrid vertical={false} strokeDasharray="3 7" stroke={GRID} />
       <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: LABEL, fontSize: 11 }} minTickGap={16} />
       <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: LABEL, fontSize: 11 }} />
       <Tooltip contentStyle={tooltipStyle} />
       <Area type="monotone" dataKey="count" name="New incidents" stroke="#15d5dc" strokeWidth={2.8}
         fill="url(#opsTrendFill)" dot={false} activeDot={{ r: 5, stroke: "#0b2635", strokeWidth: 2 }} />
     </AreaChart>
   </ResponsiveContainer>
 </div>);
}
