// Libs
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import ImageSlider from "./ImageSlider";

const Slider = () => {
  // const [images, setImages] = useState([]);

  // // fetch all images
  // const fetchImages = async () => {
  //   const response = await axios.get(
  //     `${import.meta.env.VITE_APP_BASE_URL}/slider/getallimages`
  //   );
  //   setImages(response.data);
  // };

  const {
    data: images,
    isLoading,
    error,
  } = useQuery(
    "SlidersPage",
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/slider/getallimages`
      );
      return response.data;
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  if (isLoading) return null;

  if (error) return <div>Error: {error.message}</div>;

  return <ImageSlider images={images} />;
};

export default Slider;
