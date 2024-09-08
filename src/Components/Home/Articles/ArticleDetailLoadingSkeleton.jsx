import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ArticleDetailsPageLoadingSkeleton = () => {
  return (
    <main className="max-w-7xl mx-auto my-4 bg-white p-4 rounded-md">
      <h1 className="text-6xl font-bold text-green-800 my-4">
        <Skeleton width={400} height={40} />
      </h1>
      <div className="flex items-center justify-center">
        <div className="w-full h-96 bg-gray-200 rounded-md"></div>
      </div>
      <div className="w-full mx-auto">
        <div className="flex items-center justify-center gap-4 overflow-x-scroll">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-32 h-32 bg-gray-200 rounded-md my-2 skeleton-effect"
            ></div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between my-4">
        <h3 className="text-xl font-semibold px-12 py-1 rounded-md text-white">
          <Skeleton width={200} height={30} />
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full skeleton-effect"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-full skeleton-effect"></div>
        </div>
      </div>

      <div className="w-full h-96 bg-gray-200 rounded-md skeleton-effect"></div>

      <h2 className="text-xl font-bold text-green-800 mt-12">Related Breeds</h2>

      <section className="overflow-hidden-scroll flex items-center gap-4 overflow-x-scroll">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="w-72 p-4 rounded-md bg-gray-200 my-2 h-[350px] skeleton-effect"
          ></div>
        ))}
      </section>
    </main>
  );
};

export default ArticleDetailsPageLoadingSkeleton;
