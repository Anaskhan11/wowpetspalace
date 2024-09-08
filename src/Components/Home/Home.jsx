// Libs
import React from "react";
import Article from "./Articles/Article";
import Accessories from "./Accessories/Accessories";
import SafePetSection from "./breeds/SafePetSection";
import CategorySection from "./CategorySection/CategorySection";
import Slider from "../imageSlider/Sliders";
import "react-responsive-carousel/lib/styles/carousel.min.css";
//import VideoSection from "./Bannerad/VideoSection";
import ShowProducts from "../mk_products/ShowProducts";
import ProductCard from "../mk_productCard/ProductCard";

const Home = () => {
  return (
    <div>
      <Slider />
      {/* <VedioSection /> */}
      <SafePetSection />
      <CategorySection />

      <ProductCard />
      <ShowProducts />
      <Article />
      <Accessories />
    </div>
  );
};

export default Home;
