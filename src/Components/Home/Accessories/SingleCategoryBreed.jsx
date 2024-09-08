// libs
import { Link } from "react-router-dom";
import DescriptionComponent from "../../DestructureTextFromJSX/StringhtmlToText";
import { LazyLoadImage } from "react-lazy-load-image-component";

// Icons
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";

const SingleCategoryBreed = ({ groupedData, category, index }) => {
  const containerClassName = `categorybreed-scroll-${index}`;

  const handleLeftScroll = () => {
    document.querySelector(`.${containerClassName}`).scrollLeft -= 300;
  };

  const handleRightScroll = () => {
    document.querySelector(`.${containerClassName}`).scrollLeft += 300;
  };

  return (
    <div key={index} className="relative">
      <div
        onClick={handleLeftScroll}
        className="absolute top-44 left-2 flex items-center justify-center p-2 rounded-full bg-white shadow-md shadow-gray-400 cursor-pointer"
      >
        <TiChevronLeft className="text-3xl text-green-800 h-8 w-8 sm:h-10 sm:w-10" />
      </div>
      <div className="flex items-center justify-between">
        <h4 className="text-2xl font-bold text-slate-700 my-3">
          Popular {category} Breeds{" "}
        </h4>
        <Link to="/articles" className="font-bold text-green-800 text-xl">
          Search
        </Link>
      </div>
      <div>
        <div
          className={`${containerClassName} flex items-center gap-4`}
          style={{
            overflowX: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {groupedData[category].map((data, index) => (
            <Link
              to={`breed/${data.category_title.toLowerCase()}/${data.category_title.toLowerCase()}-breeds/${
                data.slug
              }`}
              key={index}
            >
              <div
                key={index}
                className="w-72 p-4 rounded-md transition-all hover:shadow-md bg-white my-2 hover:cursor-pointer h-[350px]"
              >
                <div>
                  <LazyLoadImage
                    src={`${import.meta.env.VITE_APP_BASE_URL}/${
                      data.breed_images[0]
                    }`}
                    alt=""
                    className="h-48 w-full object-cover rounded-md"
                  />
                </div>

                <div>
                  <h6
                    className="text-xl font-bold text-green-900"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {data.breed_title}
                  </h6>
                  <div className="text-slate-600">
                    <DescriptionComponent
                      description={data.breed_description}
                      options={{ start: 0, end: data.breed_description.length }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div
        onClick={handleRightScroll}
        className="absolute top-44 right-2 flex items-center justify-center p-2 rounded-full bg-white shadow-md shadow-gray-400 cursor-pointer"
      >
        <TiChevronRight className="text-3xl text-green-800 h-8 w-8 sm:h-10 sm:w-10 " />
      </div>
    </div>
  );
};

export default SingleCategoryBreed;
