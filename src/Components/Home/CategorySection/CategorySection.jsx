// Libs
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import axios from "axios";
import CategorySectionLoadingSkeleton from "./CategorySectionLoadingSkeleton";

const CategorySection = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery(
    "CategorySection",
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/breed/getbreed`
      );
      return response.data;
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  if (isLoading) return <CategorySectionLoadingSkeleton />;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <main className="max-w-7xl mx-auto">
      <div>
        <div>
          <h2 className="text-xl font-semibold my-3">Categories</h2>
          <div className="flex items-center flex-wrap lg:gap-6 md:gap-4 sm:gap-2 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                className="flex flex-col gap-2 items-center text-center"
                to={`/category/${category.id}`}
              >
                <div className="d-flex  flex-column align-items-center text-center">
                  <LazyLoadImage
                    className="w-12 h-12 hover:scale-110 rounded-full p-2 transition-all hover:shadow-lg bg-white"
                    src={`${import.meta.env.VITE_APP_BASE_URL}/${
                      category.image
                    }`}
                    alt={category.title}
                  />
                  <small className="my-2">{category.title}</small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategorySection;
