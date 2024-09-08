import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ArticleDetailsPage } from "./Components/Home/Articles/ArticleDetailsPage";
import { useContext } from "react";
import { SidebarContext } from "./Context/SidebarContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Footer from "./Components/Footer/Footer";
import BreedsDetailsPage from "./Components/Home/breeds/BreedsDetailsPage";
import Signup from "./Components/Auth/Signup/Signup";
import Login from "./Components/Auth/Login/Login";
import Main from "./Components/Navbar/Main";
import CategoryDetails from "./Components/CategoryDetails/CategoryDetails";
import Home from "./Components/Home/Home";
import AdvertisementForm from "./Components/Home/AdvertisementForm";
import AllArticles from "./Components/Home/Articles/AllArticles";

import LoadingBar from "react-top-loading-bar";
import AllBreeds from "./Components/Home/breeds/AllBreeds";
import PrivacyPolicy from "./Components/PrivacyPolicy/PrivacyPolicy";
import TermsConditions from "./Components/TermsConditions/TermsConditions";
import ContactUsForm from "./Components/contact/ContactUsForm";
import ProductDetails from "./Components/mk_products/ProductDetails";
import Checkout from "./Components/mk_products/Checkout";
function App() {
  const { dispatch } = useContext(SidebarContext);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const newProgress = (scrollPosition / totalHeight) * 100;
      setProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [progress]);

  return (
    <div className="flex flex-col min-h-screen justify-between overflow-hidden-scroll bg-gray">
      <main>
        <Main />
        <LoadingBar
          color="green"
          height={5}
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
        <section className="mx-2" onClick={() => dispatch({ type: "UNSET" })}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/category/:id" element={<CategoryDetails />} />
            <Route
              path="/article/:categoryTitle/:slug"
              element={<ArticleDetailsPage />}
            />

            <Route
              path={`/breed/:breedCategory/:breedCategory/:slug`}
              element={<BreedsDetailsPage />}
            />
            <Route path="/advertisement" element={<AdvertisementForm />} />
            <Route path="/allarticles" element={<AllArticles />} />
            <Route
              path="/allarticles/:categoryName"
              element={<AllArticles />}
            />
            <Route path="/allbreeds" element={<AllBreeds />} />
            <Route path="/allbreeds/:categoryName" element={<AllBreeds />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsConditions />} />
            <Route path="/contact-us" element={<ContactUsForm />} />

            <Route path="/productdetail/:slug" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
          <ToastContainer />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
