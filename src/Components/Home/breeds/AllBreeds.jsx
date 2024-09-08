// Libs
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate, Link, useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Pagination from "../../Pagination/Pagination";
import DescriptionComponent from "../../DestructureTextFromJSX/StringhtmlToText";
import axios from "axios";

// Icons
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import AllBreedsLoadingSkeleton from "./AllBreedLoadingSkeleton";

const AllBreeds = () => {
  const [category, setCategory] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isCategoryFiltered, setIsCategoryFiltered] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { categoryName } = useParams();

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery(
    "breedCategoriesOnAllBreedsPage",
    async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/breed/breedshow`
      );
      return res.data;
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  const {
    data: breeds,
    isLoading: breedsLoading,
    error: breedsError,
  } = useQuery("allBreedsOnAllBreedsPage", async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_APP_BASE_URL}/breed/showallbreed/${page}`
    );
    return res.data;
  });

  const [filteredBreeds, setFilteredBreeds] = useState([]);

  useEffect(() => {
    setActiveCategory(categoryName || "");
  }, [categoryName]);

  useEffect(() => {
    if (!search) {
      setFilteredBreeds(breeds?.data || []);
    } else {
      const filteredResults = breeds?.data?.filter((breed) =>
        breed.breed_title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredBreeds(filteredResults || []);
    }
  }, [search, breeds?.data]);

  useEffect(() => {
    if (breeds?.data) {
      const filterBreedsByCategory = () => {
        if (activeCategory) {
          const filtered = breeds.data.filter(
            (breed) => breed.category_title === activeCategory
          );
          setFilteredBreeds(filtered);
          setIsCategoryFiltered(true); // Set isCategoryFiltered to true when filtering by category
        } else {
          setFilteredBreeds(breeds.data);
          setIsCategoryFiltered(false); // Set isCategoryFiltered to false when not filtering by category
        }
      };
      filterBreedsByCategory();
    }
  }, [activeCategory, breeds?.data]);

  const handleCategory = (category) => {
    setCategory(category.title);
    setActiveCategory(category.title);
  };

  if (categoriesLoading || breedsLoading) return <AllBreedsLoadingSkeleton />;
  if (categoriesError || breedsError)
    return <p>Error: {categoriesError || breedsError}</p>;

  return (
    <>
      <h2 className="text-3xl font-bold text-green-800 max-w-7xl mx-auto p-4">
        Displaying a list of {breeds.data.length} breeds per page
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
              onClick={() => setActiveCategory(null)}
            >
              clear
            </p>
          </div>

          <h3 className="text-md font-semibold my-2 mt-4">Type of listing</h3>
          <div className="flex gap-2 flex-wrap">
            {categories.length !== 0 &&
              categories.map((category) => (
                <p
                  key={category.id}
                  className={`px-3 py-1 rounded-full cursor-pointer ${
                    category.title === activeCategory
                      ? "bg-green-800 text-white"
                      : "bg-white text-black"
                  }`}
                  onClick={() => handleCategory(category)}
                >
                  {category.title}
                </p>
              ))}
          </div>
          <h3 className="text-md font-semibold my-2 mt-4">Breed</h3>
          <div className="border-2 border-slate-700 rounded-md flex items-center gap-2 px-2">
            <IoSearchOutline className="text-slate-700 h-8 w-8" />
            <input
              type="text"
              placeholder="Filter Breed"
              className="border-transparent bg-transparent w-full placeholder-slate-700 ring-transparent focus:ring-transparent focus:border-transparent focus:outline-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="lg:w-5/6 w-full md:w-full sm:w-full">
          {filteredBreeds.map((breed) => (
            <Link
              to={`/breed/${breed.category_title.toLowerCase()}/${breed.category_title.toLowerCase()}-breeds/${
                breed.slug
              }`}
              key={breed.breed_id}
            >
              <div className="flex sm:flex-wrap md:flex-nowrap lg:flex-nowrap flex-wrap mb-6 gap-4 rounded-md shadow-sm bg-[#fffacc] p-2">
                <div className="w-full lg:w-1/4 md:w-2/4 sm:w-full">
                  {breed.breed_images.length !== 0 && (
                    <LazyLoadImage
                      src={`${import.meta.env.VITE_APP_BASE_URL}/${
                        breed.breed_images[0]
                      }`}
                      alt="breed image"
                      className="h-72 sm:h-40 w-full object-cover rounded-md"
                    />
                  )}
                </div>
                <div className="w-3/4">
                  <h3 className="text-2xl">{breed.breed_title.slice(0, 80)}</h3>
                  <DescriptionComponent
                    description={breed.breed_description}
                    options={{ start: 0, end: 300 }}
                  />
                </div>
              </div>
            </Link>
          ))}
          {
            // Adjusted pagination condition
            // Display pagination if there are breeds to show and no search term is applied
            // OR if isCategoryFiltered is false (meaning we are not in a filtered state by category)
            // This assumes that pagination should be handled by the back-end when filtering by categories
            (filteredBreeds.length > 0 && !search) ||
            (!isCategoryFiltered && filteredBreeds.length > 0) ? (
              <Pagination
                pages={breeds.totalPages}
                setPage={setPage}
                currentPage={page}
              />
            ) : null
          }
        </div>
      </main>
    </>
  );
};

export default AllBreeds;
