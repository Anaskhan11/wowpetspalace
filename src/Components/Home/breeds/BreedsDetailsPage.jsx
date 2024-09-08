// Libs
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import RelatedCategoryBreeds from "../Accessories/RelatedCategoryBreeds";
import DetailPageImageSlider from "../../imageSlider/DetailPageImageSlider";

// Icons
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import Loading from "../../Loading/Loading";
import SingleCategoryBreedLoadingSkeleton from "../Accessories/SingleCategoryBreedLoadingSkeleton";
import BreedsDetailsPageLoadingSkeleton from "./BreedDetailPageLoadingSkeleton";

const BreedsDetailsPage = () => {
  const { slug } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleImageClick = (index) => {
    setActiveIndex(index);
  };

  const {
    data: singleBreed,
    isLoading,
    error,
    refetch,
  } = useQuery(
    "BreedsDetailsPage",
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/breed/getsinglebreedbyid/${slug}`
      );
      return response.data.data;
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  const { data: relatedBreeds } = useQuery(
    "relatedBreedsonBreedsDetailsPage",
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/breed/get10BreedsbyCategory`
      );
      return response.data.data;
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

  if (isLoading) return <BreedsDetailsPageLoadingSkeleton />;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className="max-w-7xl mx-auto my-4 bg-white p-4 rounded-md">
      <h1 className="text-6xl font-bold text-green-800 my-4">
        {singleBreed.breed_title}
      </h1>
      <div className="flex items-center justify-center">
        <DetailPageImageSlider
          images={singleBreed.breed_images}
          activeIndex={activeIndex}
        />
      </div>
      <div className="w-full mx-auto">
        <div
          className="flex items-center justify-center gap-4 overflow-x-scroll"
          style={{
            scrollbarWidth: "none",
          }}
        >
          {singleBreed.breed_images.length > 1 &&
            singleBreed.breed_images.map((image, index) => (
              <img
                key={index}
                src={`${import.meta.env.VITE_APP_BASE_URL}/${image}`}
                alt=""
                className={`w-32 h-32 object-cover rounded-md my-2 ${
                  activeIndex === index ? "border-4 border-yellow-500" : ""
                }`}
                onClick={() => handleImageClick(index)}
              />
            ))}
        </div>
      </div>
      <div className="flex items-center justify-between my-4">
        <h3
          className="text-xl font-semibold px-12 py-1 rounded-md bg-green-800 text-white"
          style={{ wordWrap: "break-word" }}
        >
          {singleBreed.category_title}
        </h3>
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

      <p
        className="text-balance"
        dangerouslySetInnerHTML={{ __html: singleBreed.breed_description }}
      />

      <h2 className="text-xl font-bold text-green-800 mt-12">Related Breeds</h2>

      <section className="overflow-hidden-scroll flex items-center gap-4 overflow-x-scroll">
        <RelatedCategoryBreeds
          groupedData={relatedBreeds}
          category={singleBreed.category_title}
        />
      </section>
    </main>
  );
};

export default BreedsDetailsPage;
