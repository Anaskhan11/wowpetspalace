// Libs
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import axios from "axios";
import ArticlesPage from "./ArticlesPage";
import StringToHtml from "../../DestructureTextFromJSX/StringhtmlToText";

// icons
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import ArticleDetailsPageLoadingSkeleton from "./ArticleDetailLoadingSkeleton";

export const ArticleDetailsPage = () => {
  const { slug } = useParams();

  const {
    data: articles,
    isLoading,
    error,
  } = useQuery(
    "ArticleDetailsPage",
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

  const {
    data: currentArticle,
    isLoading: currentArticleLoading,
    error: currentArticleError,
    refetch,
  } = useQuery(
    "CurrentArticleOnArticleDetailPage",
    async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/article/getsinglearticlebyid/${slug}`
      );
      return response.data.data[0];
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    refetch();
  }, [slug, refetch]);

  if (isLoading || currentArticleLoading)
    return <ArticleDetailsPageLoadingSkeleton />;

  if (error || currentArticleError) return <div>Error: {error.message}</div>;

  return (
    <main className="max-w-7xl mx-auto my-4 bg-white p-4 rounded-md">
      <div className="flex items-center justify-center">
        <LazyLoadImage
          loading="lazy"
          src={`${import.meta.env.VITE_APP_BASE_URL}/${currentArticle.image}`}
          alt="article image"
          className="w-2/3 lg:h-[500px] sm:h-72 object-center object-cover rounded-md"
        />
      </div>
      <div className="flex items-center justify-between my-4">
        <h3 className="text-xl font-semibold p-1 rounded-md bg-green-800 text-white">
          {currentArticle.categoryName}
        </h3>
        <p>
          {currentArticle.createdAt && StringToHtml(currentArticle.createdAt)}
        </p>
        <div className="flex items-center gap-2">
          <a
            href="https://twitter.com/i/flow/login"
            className="flex items-center justify-center cursor-pointer"
            target="_blank"
          >
            <AiFillTwitterCircle className="text-3xl text-green-800" />
          </a>
          <a
            href="https://www.facebook.com/"
            className="flex items-center justify-center cursor-pointer"
            target="_blank"
          >
            <FaFacebook className="text-3xl text-green-800" />
          </a>
        </div>
      </div>
      <h1 className="text-6xl font-bold text-green-800 my-4">
        {currentArticle.title}
      </h1>
      <p
        className="text-balance"
        dangerouslySetInnerHTML={{ __html: currentArticle.description }}
      />

      <h2 className="text-xl font-bold text-green-800 mt-12">
        Related Articles
      </h2>

      <section className="overflow-hidden-scroll flex items-center gap-4 overflow-x-scroll">
        {articles
          .filter(
            (articles) =>
              articles.id !== currentArticle.id &&
              articles.categoryName === currentArticle.categoryName
          )
          .map((article) => (
            <Link
              to={`/article/${article.categoryName.toLowerCase()}-article/${
                article.slug
              }`}
              state={{ data: article }}
            >
              <ArticlesPage data={article} />
            </Link>
          ))}
      </section>
    </main>
  );
};
