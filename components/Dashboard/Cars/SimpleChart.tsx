"use client";
import React from "react";

interface SimpleChartProps {
  isRtl?: boolean;
}

export default function SimpleChart({ isRtl = false }: SimpleChartProps) {
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

  const maxCars = Math.max(...data.map((d) => d.cars));
  const maxViews = Math.max(...data.map((d) => d.views));

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col pt-8">
      <div className="flex-1 flex items-end justify-between gap-1 pb-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex-1 group relative flex flex-col items-center"
          >
            <div className="w-full max-w-[20px] flex flex-col-reverse items-end space-y-reverse space-y-0.5">
              <div
                className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-sm transition-all duration-700 ease-out group-hover:from-primary group-hover:to-primary/90"
                style={{
                  height: `${(item.cars / maxCars) * 180}px`,
                  minHeight: "4px",
                }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {item.cars} {isRtl ? "سيارة" : "Cars"}
                </div>
              </div>
              <div
                className="w-full bg-gradient-to-t from-gray-200 to-gray-300 rounded-sm transition-all duration-700 delay-75 ease-out group-hover:from-gray-300 group-hover:to-gray-400"
                style={{
                  height: `${(item.views / maxViews) * 120}px`,
                  minHeight: "4px",
                }}
              ></div>
            </div>
            <div className="absolute -bottom-6 text-[10px] font-bold text-gray-400 uppercase tracking-tighter group-hover:text-primary transition-colors">
              {item.name}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-8 mt-12 pt-6 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1.5 bg-primary rounded-full"></div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            {isRtl ? "المخزون" : "Inventory"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1.5 bg-gray-300 rounded-full"></div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            {isRtl ? "المشاهدات" : "Analytics"}
          </span>
        </div>
      </div>
    </div>
  );
}
