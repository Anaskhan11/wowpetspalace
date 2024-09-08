import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
const SafePetSection = () => {
  return (
    <div className="row">
      <div className="w-full mx-auto">
        <LazyLoadImage
          src="./assets/images/prioritypets.jfif"
          alt=""
          className="w-full mx-auto"
        />
      </div>
    </div>
  );
};

export default SafePetSection;
