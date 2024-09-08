// libs
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import axios from "axios";
import Pagination from "../../Pagination/Pagination";
import DescriptionComponent from "../../DestructureTextFromJSX/StringhtmlToText";

// Icons
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import AllArticlesLoadingSkeleton from "./AllArticleLoadingSkeleton";

const AllArticles = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");

  const { categoryName } = useParams();

  useEffect(() => {
    setCurrentCategory(categoryName || "");
  }, [categoryName]);

  const {
    data: articleCategories,
    isLoading,
    error,
  } = useQuery(
    "AllArticlesCategories",
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/article/showarticle`
      );
      return response.data;
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  useEffect(() => {
    if (searchTerm) {
      searchApi(searchTerm);
    }
  }, [searchTerm]);

  const {
    data: articles,
    isLoading: articlesLoading,
    error: articlesError,
    refetch,
  } = useQuery(
    "AllArticlesPage",
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/article/getarticles/${page}`
      );
      return response.data;
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    refetch();
  }, [page, refetch]);

  const searchApi = async (title) => {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_BASE_URL}/article/search/${title}`
    );
    setSearchResults(response.data.data);
  };

  const filteredArticles =
    searchTerm && searchResults && articles
      ? searchResults
      : articles?.articles.filter((article) =>
          currentCategory ? article.categoryName === currentCategory : article
        );

  if (articlesLoading || isLoading) return <AllArticlesLoadingSkeleton />;

  if (articlesError || error) return <div>Error: {articlesError?.message}</div>;

  return (
    <>
      <h2 className="text-3xl font-bold text-green-800 max-w-7xl mx-auto p-4">
        Displaying a list of {articles?.articles?.length} Articles per page
      </h2>
      <main className="p-4 flex items-start justify-between gap-10 max-w-7xl mx-auto flex-wrap lg:flex-nowrap md:flex-wrap sm:flex-wrap">
        <div className="lg:w-2/6 w-full md:w-full sm:w-full p-4 rounded-md shadow-sm bg-amber-100">
          <div className="flex items-center justify-between d">
            <h2 className="text-green-800 font-bold text-2xl flex items-center gap-2">
              <IoMdArrowRoundBack
                className="h-6 w-6 items-center justify-center cursor-pointer hover:scale-125 transition-all duration-300 ease-in-out"
                onClick={() => navigate("/")}
              />
              <span>Filter</span>
            </h2>
            <p
              className="font-semibold px-3 py-1 rounded-full cursor-pointer bg-green-800 text-white"
              onClick={() => setCurrentCategory("")}
            >
              clear
            </p>
          </div>

          <h3 className="text-md font-semibold my-2 mt-4">Type of listing</h3>
          {/* All Articles */}
          <div className="flex flex-wrap gap-2 ">
            {articleCategories.map((category, index) => (
              <span
                className={`text-md font-semibold px-3 py-2 rounded-full cursor-pointer ${
                  currentCategory === category.categoryName
                    ? "bg-green-500 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setCurrentCategory(category.categoryName)}
                key={index}
              >
                {category.categoryName}
              </span>
            ))}
          </div>
        </div>
        <div className="lg:w-5/6 w-full md:w-full sm:w-full">
          <div className="px-3 py-1 rounded-md border border-slate-700 flex items-center gap-2 mb-4">
            <IoSearchOutline className="text-slate-700 h-8 w-8" />
            <input
              type="text"
              placeholder="Search for Articles"
              className="border-none outline-none focus:ring-0 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredArticles.map((article, index) => (
            <Link
              to={`/article/${article.categoryName.toLowerCase()}-article/${
                article.slug
              }`}
              key={index}
            >
              <div className="flex sm:flex-wrap md:flex-nowrap lg:flex-nowrap flex-wrap mb-6 gap-4 rounded-md shadow-sm bg-[#fffacc] p-2">
                <div className="w-full lg:w-1/4 md:w-2/4 sm:w-full ">
                  <LazyLoadImage
                    src={`${import.meta.env.VITE_APP_BASE_URL}/${
                      article.image
                    }`}
                    alt="breed image"
                    className="h-72 sm:h-40 w-full object-cover rounded-md"
                  />
                </div>
                <div className="w-3/4 ">
                  <h3 className="text-2xl">{article.title.slice(0, 80)}</h3>
                  <DescriptionComponent
                    description={article.description}
                    options={{ start: 0, end: 300 }}
                  />
                </div>
              </div>
            </Link>
          ))}
          {filteredArticles.length > 0 && (
            <Pagination
              pages={articles?.totalPages || 1}
              setPage={setPage}
              currentPage={page}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default AllArticles;
