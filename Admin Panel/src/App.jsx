import { useState, useEffect, Suspense, lazy } from "react";
import { Route, Routes, useParams, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";

import ProtectedRoute from "./Components/Authenticated/Authenticated";

import secureLocalStorage from "react-secure-storage";

const Role = lazy(() => import("./Components/Role/Role"));
const AddRole = lazy(() => import("./Components/Role/AddRole"));
const Users = lazy(() => import("./Components/User/Users"));
const AddUser = lazy(() => import("./Components/User/AddUser"));
const EditUser = lazy(() => import("./Components/User/EditUser"));
const ShowArticles = lazy(() => import("./Components/Articles/ShowArticles"));
const AddArticles = lazy(() => import("./Components/Articles/AddArticles"));
const EditArticles = lazy(() => import("./Components/Articles/EditArticles"));
const ShowCategory = lazy(() =>
  import("./Components/CategoryArticles/ShowCategory")
);
const EditCategory = lazy(() =>
  import("./Components/CategoryArticles/EditCategory")
);
const AddCategoryArticle = lazy(() =>
  import("./Components/CategoryArticles/AddCategoryArticle")
);
const Login = lazy(() => import("./Components/Login/Login"));
const Sidebar = lazy(() => import("./Components/Dashboard/Sidebar/Sidebar"));
const Topbar = lazy(() => import("./Components/Dashboard/Navbar/Topbar"));
const Main = lazy(() => import("./Components/Dashboard/MainHome/Main"));
const AddBreeds = lazy(() => import("./Components/Breeds/AddBreeds"));
const AddBreedCategory = lazy(() =>
  import("./Components/BreedsCategory/AddBreedCategory")
);
const BreedsCategory = lazy(() =>
  import("./Components/BreedsCategory/BreedsCategory")
);
const EditBreedCategory = lazy(() =>
  import("./Components/BreedsCategory/EditBreedCategory")
);
const ShowBreeds = lazy(() => import("./Components/Breeds/ShowBreeds"));
const EditBreeds = lazy(() => import("./Components/Breeds/EditBreeds"));
const Advertisement = lazy(() =>
  import("./Components/Advertisement/Advertisement")
);
const AdvertisementDetailsPage = lazy(() =>
  import("./Components/Advertisement/AdvertisementDetailsPage")
);
const AppUser = lazy(() => import("./Components/AppUser/AppUser"));
const DetailsPage = lazy(() => import("./Components/Common/DetailsPage"));
const Slider = lazy(() => import("./Components/slider/Slider"));
const AddSlider = lazy(() => import("./Components/slider/AddSlider"));
const PrivacyPolicy = lazy(() => import("./Components/Privacy/PrivacyPolicy"));
const TermsConditions = lazy(() =>
  import("./Components/TermsConditions/TermsConditions")
);
const EditPrivacyPolicy = lazy(() =>
  import("./Components/Privacy/EditPrivacyPolicy")
);
const EditTermsConditions = lazy(() =>
  import("./Components/TermsConditions/EditTermsConditions")
);
const AddPrivacyPolicy = lazy(() => import("./Components/Privacy/AddPrivacy"));
const AddTermsConditions = lazy(() =>
  import("./Components/TermsConditions/AddTermsConditions")
);
const ContactUs = lazy(() => import("./Components/ContactUs/ContactUs"));
const AddContactCategory = lazy(() =>
  import("./Components/ContactUs/AddContactCategory")
);
const AddContactReason = lazy(() =>
  import("./Components/ContactUs/AddContactReason")
);
const NotFoundPage = lazy(() => import("./Components/not-found"));
import LoadingDots from "./Components/Loading/Loading";

import { SidebarContext } from "./context/SidebarContext";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import { IdleTimerService } from "./utils/idleTimeoutService";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import tokenExpired from "./utils/tokenExpired";
import AddTags from "./Components/Articles/AddTags";
import AddBreedTags from "./Components/Breeds/AddBreedTags";
import ShowRoleInfo from "./Components/Role/ShowRoleInfo";
import AddShops from "./Components/mk_shops/AddShops";
import EditShop from "./Components/mk_shops/EditShop";
import ShowShops from "./Components/mk_shops/ShowShops";
import ProductDetails from "./Components/mk_products/ProductDetails";
import Category from "./Components/mk_products/Category";
import ShowProductList from "./Components/mk_products/ShowProductList";
import ShowOrder from "./Components/mk_orders/ShowOrder";
import OrderDetailsPage from "./Components/mk_orders/OrderDetailsPage";
import OrderLogs from "./Components/mk_orders/OrderLogs";
import AddDiscount from "./Components/mk_products/AddDiscount";

const DashboardLayout = ({ setIsAuthenticated }) => {
  const { sidebar } = useContext(SidebarContext);
  return (
    <>
      <Sidebar />
      <Topbar setIsAuthenticated={setIsAuthenticated} />
      <main
        id={sidebar ? "content-2" : "content"}
        className={sidebar === true ? "content-hidden" : ""}
      >
        <Outlet />
      </main>
    </>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Define as a separate function for clarity
    const checkAuthentication = () => {
      const accessToken = secureLocalStorage.getItem("accessToken");
      // Simplified validation, consider extracting this logic if it becomes more complex
      setIsAuthenticated(!!accessToken && !tokenExpired(accessToken));
    };

    checkAuthentication();

    // Assuming IdleTimerService triggers logout or relevant state changes
    IdleTimerService.init();
    return () => {
      IdleTimerService.stop();
    };
  }, []); // This effect runs once on component mount - consider adding dependencies if needed

  if (isAuthenticated === null) {
    // Authentication status not yet determined, show loading or blank state
    return <LoadingDots />;
  }

  return (
    <>
      <Suspense fallback={<LoadingDots />}>
        <Routes>
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route
              element={
                <DashboardLayout setIsAuthenticated={setIsAuthenticated} />
              }
            >
              <Route path="/dashboard" index element={<Main />} />
              <Route path="/role" element={<Role />} />
              <Route path="/addRole" element={<AddRole />} />
              <Route path="/showRoleInfo/:id" element={<ShowRoleInfo />} />
              <Route path="/user" element={<Users />} />
              <Route path="/adduser" element={<AddUser />} />
              <Route path="/edituser/:id" element={<EditUser />} />
              <Route path="/detailpage" element={<DetailsPage />} />
              <Route path="/Articles" element={<ShowArticles />} />
              <Route path="/addarticle" element={<AddArticles />} />
              <Route path="/editarticle/:id" element={<EditArticles />} />
              <Route path="/categoryarticles" element={<ShowCategory />} />
              <Route path="/addcategory" element={<AddCategoryArticle />} />
              <Route path="/editcategory/:id" element={<EditCategory />} />
              <Route path="/Breeds" element={<ShowBreeds />} />
              <Route path="/breedscategory" element={<BreedsCategory />} />
              <Route
                path="/editbreedcategory/:id"
                element={<EditBreedCategory />}
              />
              <Route
                path="/createbreedscategory"
                element={<AddBreedCategory />}
              />
              <Route path="/editsinglebreed/:id" element={<EditBreeds />} />
              <Route path="/addbreeds" element={<AddBreeds />} />
              <Route path="/addbreedtags" element={<AddBreedTags />} />

              <Route path="/advertisement" element={<Advertisement />} />
              <Route
                path="/advertisement/:id"
                element={<AdvertisementDetailsPage />}
              />

              <Route path="/app user" element={<AppUser />} />
              <Route path="/slider" element={<Slider />} />
              <Route path="/addslider" element={<AddSlider />} />

              <Route path="/privacy policy" element={<PrivacyPolicy />} />
              <Route path="/addpolicy" element={<AddPrivacyPolicy />} />
              <Route path="/editpolicy/:id" element={<EditPrivacyPolicy />} />

              <Route path="/term and condition" element={<TermsConditions />} />
              <Route path="/addterms" element={<AddTermsConditions />} />
              <Route path="/editterm/:id" element={<EditTermsConditions />} />

              <Route path="/contact_us" element={<ContactUs />} />
              <Route path="/addtags" element={<AddTags />} />
              <Route
                path="/add-contact-category"
                element={<AddContactCategory />}
              />
              <Route
                path="/add-contact-reason"
                element={<AddContactReason />}
              />

              <Route path="/shops" element={<ShowShops />} />
              <Route path="/addshop" element={<AddShops />} />
              <Route path="/editshop/:id" element={<EditShop />} />
              <Route
                path="/productdetails/:id"
                element={<ProductDetailsWrapper />}
              />

              <Route path="/product_category" element={<Category />} />
              <Route path="/productlist" element={<ShowProductList />} />
              <Route path="/Orders" element={<ShowOrder />} />
              <Route path="/orderdetails/:id" element={<OrderDetailsPage />} />
              <Route path="/transactionrecords" element={<OrderLogs />} />
              <Route path="/discount/:shopId" element={<AddDiscount />} />
            </Route>
          </Route>
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            }
          />
        </Routes>
        <ToastContainer />
      </Suspense>
    </>
  );
}

const ProductDetailsWrapper = () => {
  const { id } = useParams();
  console.log("products wrapper", id);
  return <ShowProductList shopId={id} />;
};

export default App;
