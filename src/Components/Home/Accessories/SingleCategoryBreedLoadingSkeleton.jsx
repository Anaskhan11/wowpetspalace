import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SingleCategoryBreedLoadingSkeleton = () => {
  return (
    <div className="relative">
      <div className="absolute top-44 left-2 flex items-center justify-center p-2 rounded-full bg-white shadow-md shadow-gray-400 cursor-pointer">
        <Skeleton circle width={32} height={32} />
      </div>
      <div className="flex items-center justify-between">
        <h4 className="text-2xl font-bold text-slate-700 my-3">
          <Skeleton width={200} />
        </h4>
        <Skeleton width={100} height={30} />
      </div>
      <div>
        <div className="flex items-center gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-72 p-4 rounded-md transition-all bg-white my-2 h-[350px] skeleton-effect"
            >
              <Skeleton height={192} />
              <Skeleton count={2} />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-44 right-2 flex items-center justify-center p-2 rounded-full bg-white shadow-md shadow-gray-400 cursor-pointer">
        <Skeleton circle width={32} height={32} />
      </div>
    </div>
  );
};

export default SingleCategoryBreedLoadingSkeleton;
