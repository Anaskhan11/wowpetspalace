// Libs
import { useQuery } from "react-query";
import axios from "axios";
import SingleCategoryBreed from "./SingleCategoryBreed";
import SingleCategoryBreedLoadingSkeleton from "./SingleCategoryBreedLoadingSkeleton";

// Utility Function
const groupByCategory = (data) => {
  return data.reduce((grouped, item) => {
    const key = item.category_title;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
    return grouped;
  }, {});
};

const Accessories = () => {
  const {
    data: showData,
    isLoading,
    error,
  } = useQuery(
    "accessories",
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

  if (isLoading) return null;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <main className="max-w-7xl mx-auto">
      <div className="my-8">
        {showData &&
          Object.keys(groupByCategory(showData)).map((category, index) => (
            <SingleCategoryBreed
              groupedData={groupByCategory(showData)}
              category={category}
              key={index}
              index={index}
            />
          ))}
      </div>
    </main>
  );
};
export default Accessories;
