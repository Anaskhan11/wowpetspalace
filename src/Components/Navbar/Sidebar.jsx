// Libs
import { Sidebar } from "flowbite-react";
import { useContext, useState, useEffect } from "react";
import { SidebarContext } from "../../Context/SidebarContext";
import axios from "axios";

// Icons
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { TiChevronRight } from "react-icons/ti";
import { IoChevronDownSharp } from "react-icons/io5";
import { ImCross } from "react-icons/im";

export function MainSidebar() {
  const { dispatch, state } = useContext(SidebarContext);
  const [showPets, setShowPets] = useState(false);
  const [showBreeds, setShowBreeds] = useState(false);
  const [articleCategories, setArticleCategories] = useState([]);
  const [breedCategories, setBreedCategories] = useState([]);

  useEffect(() => {
    const getAllBreedCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/breed/getbreed`
        );
        setBreedCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllArticleCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/article/showarticle`
        );

        setArticleCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllArticleCategories();
    getAllBreedCategories();
  }, []);

  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown"
      className="main-sidebar shadow-lg bg-slate-800"
    >
      {!state.isOpen && (
        <div className="p-2 rounded-md bg-slate-200 border-slate-400 flex items-center justify-center w-fit">
          <GiHamburgerMenu
            className="h-6 w-6 flex items-center justify-center hover:cursor-pointer"
            onClick={() => dispatch({ type: "TOGGLE" })}
          />
        </div>
      )}
      {state.isOpen && (
        <div className="p-4 bg-white flex items-center justify-end w-full border-b-2 border-b-slate-400">
          <ImCross
            className="h-6 w-6 flex items-center justify-center hover:cursor-pointer"
            onClick={() => dispatch({ type: "TOGGLE" })}
          />
        </div>
      )}
      <div className="my-8"></div>
      <h2 className="text-2xl font-bold mt-20">Knowledge hub</h2>

      <ul className="mt-4 w-full">
        <li className="border-b border-b-slate-300 p-4 hover:bg-stone-200">
          <Link to="/" className="text-black text-lg font-medium">
            Home
          </Link>
        </li>
        <li className="border-b border-b-slate-300 cursor-pointer">
          <p
            onClick={() => setShowPets(!showPets)}
            className="font-semibold text-xl hover:bg-stone-200  p-4 flex items-center justify-between"
          >
            <span>Pets articles & advice</span>
            {!showPets && <TiChevronRight className="h-6 w-6 inline-block" />}
            {showPets && (
              <IoChevronDownSharp className="h-6 w-6 inline-block" />
            )}
          </p>
          {showPets && (
            <div className="flex flex-col gap-4 mt-3">
              {articleCategories.map((category) => (
                <Link
                  to={`/allarticles/${category.categoryName}`}
                  className="text-black text-lg font-base p-4 hover:bg-stone-200 border-b border-b-slate-300"
                >
                  {category.categoryName}
                </Link>
              ))}
            </div>
          )}
        </li>
        <li className="border-b border-b-slate-300 cursor-pointer">
          <p
            onClick={() => setShowBreeds(!showBreeds)}
            className="font-semibold text-xl hover:bg-stone-200  p-4 flex items-center justify-between"
          >
            <span>Breed Directory</span>
            {!showBreeds && <TiChevronRight className="h-6 w-6 inline-block" />}
            {showBreeds && (
              <IoChevronDownSharp className="h-6 w-6 inline-block" />
            )}
          </p>
          {showBreeds && (
            <div className="flex flex-col justify-start gap-4 mt-3">
              {breedCategories.map((category) => (
                <Link
                  to={`/allbreeds/${category.title}`}
                  className="text-black text-lg font-base p-4 hover:bg-stone-200 border-b border-b-slate-300"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          )}
        </li>

        <li className="border-b border-b-slate-300 p-4 hover:bg-stone-200">
          <Link to="/contact-us" className="text-black text-lg font-medium">
            Contact Us
          </Link>
        </li>
      </ul>
      <ul></ul>
    </Sidebar>
  );
}
