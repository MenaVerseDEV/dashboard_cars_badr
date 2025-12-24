"use client";
import React, { Suspense } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", cars: 45, views: 1200 },
  { name: "Feb", cars: 52, views: 1500 },
  { name: "Mar", cars: 48, views: 1800 },
  { name: "Apr", cars: 61, views: 2100 },
  { name: "May", cars: 55, views: 1900 },
  { name: "Jun", cars: 67, views: 2300 },
  { name: "Jul", cars: 58, views: 2000 },
  { name: "Aug", cars: 72, views: 2500 },
  { name: "Sep", cars: 65, views: 2200 },
  { name: "Oct", cars: 78, views: 2800 },
  { name: "Nov", cars: 82, views: 3000 },
  { name: "Dec", cars: 89, views: 3200 },
];

interface CarStatisticsChartProps {
  isRtl?: boolean;
}

export default function CarStatisticsChart({
  isRtl = false,
}: CarStatisticsChartProps) {
  return (
    <div className="w-full h-64">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading chart...
          </div>
        }
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{
                color: "#374151",
                fontWeight: "600",
              }}
              formatter={(value: any, name: string) => [
                value,
                name === "cars"
                  ? isRtl
                    ? "السيارات"
                    : "Cars"
                  : isRtl
                  ? "المشاهدات"
                  : "Views",
              ]}
            />
            <Line
              type="monotone"
              dataKey="cars"
              stroke="#E22C2F"
              strokeWidth={3}
              dot={{ fill: "#E22C2F", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#E22C2F", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: "#3B82F6", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Suspense>
    </div>
  );
}

