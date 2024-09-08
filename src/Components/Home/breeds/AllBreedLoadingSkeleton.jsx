import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AllBreedsLoadingSkeleton = () => {
  return (
    <>
      <h2 className="text-3xl font-bold text-green-800 max-w-7xl mx-auto p-4">
        <Skeleton width={300} height={30} />
      </h2>
      <main className="p-4 flex items-start justify-between gap-10 max-w-7xl mx-auto flex-wrap lg:flex-nowrap md:flex-wrap sm:flex-wrap">
        <div className="lg:w-2/6 w-full md:w-full sm:w-full p-4 rounded-md shadow-sm">
          <div className="flex items-center justify-between d">
            <h2 className="font-bold text-2xl flex items-center gap-2">
              <Skeleton width={30} height={30} />
              <span>
                <Skeleton width={100} />
              </span>
            </h2>
            <p className="font-semibold px-3 py-1 rounded-full cursor-pointer">
              <Skeleton width={50} />
            </p>
          </div>

          <h3 className="text-md font-semibold my-2 mt-4">
            <Skeleton width={100} />
          </h3>
          <div className="flex gap-2 flex-wrap">
            <Skeleton width={100} height={30} />
            <Skeleton width={100} height={30} />
            <Skeleton width={100} height={30} />
          </div>
          <h3 className="text-md font-semibold my-2 mt-4">
            <Skeleton width={100} />
          </h3>
          <div className="rounded-md flex items-center gap-2 px-2">
            <Skeleton width={30} height={30} />
            <Skeleton width={150} height={30} />
          </div>
        </div>
        <div className="lg:w-5/6 w-full md:w-full sm:w-full">
          <div className="flex flex-wrap mb-6 gap-4">
            <div className="w-full lg:w-1/4 md:w-2/4 sm:w-full">
              <Skeleton height={240} />
            </div>
            <div className="w-3/4">
              <Skeleton width="90%" height={30} />
              <Skeleton count={5} height={20} />
            </div>
          </div>
          <div className="flex flex-wrap mb-6 gap-4">
            <div className="w-full lg:w-1/4 md:w-2/4 sm:w-full">
              <Skeleton height={240} />
            </div>
            <div className="w-3/4">
              <Skeleton width="90%" height={30} />
              <Skeleton count={5} height={20} />
            </div>
          </div>
          {/* Repeat skeleton layout for other breed items */}
          {/* Pagination skeleton */}
          <div className="flex justify-center mt-6">
            <Skeleton width={200} height={40} />
          </div>
        </div>
      </main>
    </>
  );
};

export default AllBreedsLoadingSkeleton;
