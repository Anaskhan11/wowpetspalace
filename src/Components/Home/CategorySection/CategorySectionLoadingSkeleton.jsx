import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CategorySectionLoadingSkeleton = () => {
  return (
    <main className="max-w-7xl mx-auto">
      <div>
        <div>
          <h2 className="text-xl font-semibold my-3">Categories</h2>
          <div className="flex items-center flex-wrap lg:gap-6 md:gap-4 sm:gap-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 items-center text-center"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full p-2"></div>
                <small className="my-2">
                  <Skeleton width={80} />
                </small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategorySectionLoadingSkeleton;
