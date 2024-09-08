// Libs
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Pagination from "../Pagination/Pagination";
import DescriptionComponent from "../DestructureTextFromJSX/StringhtmlToText";
import axios from "axios";

// Icons
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";

const CategoryDetails = () => {
  const { id } = useParams();
  // const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useQuery(
    "categoryDetailsPage",
    async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/breed/getAllBreedsbyCategoryId/${id}/${page}`
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

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <h2 className="text-3xl font-bold text-green-800 max-w-7xl mx-auto p-4">
        Displaying a list of {categories?.data?.length} breeds per page
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
            <p className="font-semibold px-3 py-1 rounded-full cursor-pointer bg-green-800 text-white">
              clear
            </p>
          </div>

          <h3 className="text-md font-semibold my-2 mt-4">Type of listing</h3>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-2 rounded-full bg-green-800 text-white">
              For sale
            </button>
            <button className="px-3 py-2 rounded-full border-2 border-slate-500">
              For Adoption
            </button>
            <button className="px-3 py-2 rounded-full border-2 border-slate-500">
              For Stud
            </button>
            <button className="px-3 py-2 rounded-full border-2 border-slate-500">
              Wanted
            </button>
          </div>
          <h3 className="text-md font-semibold my-2 mt-4">Breed</h3>
          <div className="border-2 border-slate-700 rounded-md flex items-center gap-2 px-2">
            <IoSearchOutline className="text-slate-700 h-8 w-8" />
            <input
              type="text"
              placeholder="Filter Breed"
              className="border-transparent bg-transparent w-full placeholder-slate-700 ring-transparent focus:ring-transparent focus:border-transparent focus:outline-transparent"
            />
          </div>
          <h3 className="text-md font-semibold my-2 mt-4">Price</h3>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="From " />
            <input type="number" placeholder="To" />
          </div>
        </div>
        <div className="lg:w-5/6 w-full md:w-full sm:w-full">
          {categories?.data?.length === 0 && (
            <div className="flex items-center justify-center h-96">
              <h2 className="text-3xl font-bold text-green-800">
                No breeds found
              </h2>
            </div>
          )}

          {categories?.data?.map((category) => (
            <Link
              to={`/breed/${category.category_title.toLowerCase()}/${category.category_title.toLowerCase()}-breeds/${
                category.slug
              }`}
              key={category.breed_id}
              state={{ data: category }}
            >
              <div className="flex sm:flex-wrap md:flex-nowrap lg:flex-nowrap flex-wrap mb-6 gap-4 rounded-md shadow-sm bg-[#fffacc] p-2">
                <div className="w-full lg:w-1/4 md:w-2/4 sm:w-full ">
                  {category.breed_images.length !== 0 && (
                    <LazyLoadImage
                      loading="lazy"
                      src={`${import.meta.env.VITE_APP_BASE_URL}/${
                        category.breed_images[0]
                      }`}
                      alt="breed image"
                      className="h-72 sm:h-40 w-full object-cover rounded-md"
                    />
                  )}
                </div>
                <div className="w-3/4 ">
                  <h3 className="text-2xl">
                    {category.breed_title.slice(0, 80)}
                  </h3>
                  <DescriptionComponent
                    description={category.breed_description}
                    options={{ start: 0, end: 300 }}
                  />
                </div>
              </div>
            </Link>
          ))}
          <Pagination
            pages={categories.totalPages}
            setPage={setPage}
            currentPage={page}
          />
        </div>
      </main>
    </>
  );
};

export default CategoryDetails;
