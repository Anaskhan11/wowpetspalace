// Libs
import React from "react";
import DescriptionComponent from "../../DestructureTextFromJSX/StringhtmlToText";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ArticlesPage = ({ data }) => {
  return (
    <div className="w-72 p-4 rounded-md transition-all hover:shadow-md my-2 hover:cursor-pointer h-[400px] bg-white">
      <div>
        <LazyLoadImage
          src={`${import.meta.env.VITE_APP_BASE_URL}/${data.image}`}
          alt="..."
          className="h-48 w-full object-cover rounded-md"
        />
      </div>
      <div>
        <div className="my-2">
          <span className="text-sm font-bold px-2 py-1 rounded-md bg-green-50 text-gray-900">
            {data.categoryName}
            {"life as a parent"}
          </span>
        </div>
        <h5
          className="font-semibold text-md"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {data.title}
        </h5>
        <DescriptionComponent description={data.description} />
        <a
          className="font-semibold text-green-900"
          href={`/full-article/${data.id}`}
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default ArticlesPage;
