import type React from "react";

const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full overflow-x-auto mt-5">
      <div className="w-full border-collapse space-y-5  ">
        <div className="w-full flex md:flex-row flex-col gap-5 items-center justify-between">
          <div className=" py-2 h-12 w-full md:w-1/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-full md:w-1/3 flex items-center gap-5">
            <div className=" py-2 h-12 w-20  bg-gray-200 rounded animate-pulse"></div>
            <div className=" py-2 h-12 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-2 border-t border-gray-200">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="px-6 py-2 h-12  bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;

