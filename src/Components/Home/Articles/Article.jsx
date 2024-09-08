// libs
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import axios from "axios";
import ArticlesPage from "./ArticlesPage";

// icons
import { TiChevronRight } from "react-icons/ti";
import { TiChevronLeft } from "react-icons/ti";
import ArticleDetailsPageLoadingSkeleton from "./ArticleDetailLoadingSkeleton";
import ArticlesPageLoadingSkeleton from "./ArticlePageLoadingSkeleton";

const Article = () => {
  const {
    data: articles,
    isLoading,
    error,
  } = useQuery(
    "ArticlePage",
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/article/get10Articles`
      );
      return response.data;
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  // Sort articles based on timestamp or ID in descending order
  const sortedArticles = articles?.sort((a, b) => b.timestamp - a.timestamp);

  // handleLeftScroll
  const handleLeftScroll = () => {
    document.querySelector(".article-scroll").scrollLeft -= 300;
  };

  // handleRightScroll
  const handleRightScroll = () => {
    document.querySelector(".article-scroll").scrollLeft += 300;
  };

  if (isLoading) return <ArticlesPageLoadingSkeleton />;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <main className="max-w-7xl mx-auto">
      <div>
        <div className="flex items-center justify-between">
          <h4 className="text-2xl font-bold text-slate-700 my-3">
            Latest Articles
          </h4>
          <Link to="/articles" className="font-bold text-green-800 text-xl">
            Search
          </Link>
        </div>
        <div className="relative">
          <div
            onClick={handleLeftScroll}
            className="absolute top-44 left-2 flex items-center justify-center p-2 rounded-full bg-white shadow-md shadow-gray-400 cursor-pointer"
          >
            <TiChevronLeft className="text-3xl text-green-800 h-8 w-8 sm:h-10 sm:w-10 " />
          </div>
          <div
            className="flex items-center gap-4 article-scroll"
            style={{
              overflowX: "scroll",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {sortedArticles.map((data) => (
              <Link
                to={`/article/${data.categoryName.toLowerCase()}-article/${
                  data.slug
                }`}
              >
                <ArticlesPage data={data} />
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-center">
            <Link
              to={"/allarticles"}
              className="rounded-full px-4 py-2 bg-green-900 text-white font-semibold"
            >
              Show All Articles
            </Link>
          </div>
          <div
            onClick={handleRightScroll}
            className="absolute top-44 right-2 flex items-center justify-center p-2 rounded-full bg-white shadow-md shadow-gray-400 cursor-pointer"
          >
            <TiChevronRight className="text-3xl text-green-800 h-8 w-8 sm:h-10 sm:w-10 " />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Article;
