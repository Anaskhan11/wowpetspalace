import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const articles = [1, 2, 3, 4];

const ArticlesPageLoadingSkeleton = () => {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {articles.map((a) => (
        <div className="w-72 p-4 rounded-md transition-all my-2 h-[400px] bg-white">
          <div>
            <div className="h-48 w-full bg-gray-200 rounded-md"></div>
          </div>
          <div>
            <div className="my-2">
              <span className="text-sm font-bold px-2 py-1 rounded-md bg-gray-200 text-gray-900">
                <Skeleton width={100} />
              </span>
            </div>
            <h5 className="font-semibold text-md">
              <Skeleton width={150} />
            </h5>
            <div className="text-gray-700">
              <Skeleton count={3} />
            </div>
            <a className="font-semibold text-gray-900" href="/">
              <Skeleton width={80} />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticlesPageLoadingSkeleton;
