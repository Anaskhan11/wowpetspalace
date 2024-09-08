// libs
import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const DetailPageImageSlider = ({ images, activeIndex }) => {
  const [intervalz, setIntervalz] = useState(3000);

  const onChange = (index, item) => {
    setIntervalz(item.props["data-interval"]);
  };

  return (
    <Carousel
      onChange={onChange}
      autoPlay
      infiniteLoop={true}
      swipeable={false}
      interval={intervalz}
      showStatus={false}
      showThumbs={false}
      lazyLoad
      selectedItem={activeIndex}
    >
      {images.length >= 1 ? (
        images.map((image, index) => (
          <a
            className="cursor-pointer w-full flex items-center justify-center"
            href={image.url}
            target="_blank"
          >
            <div data-interval={3000} key={index} className="w-2/3 mx-auto">
              <LazyLoadImage
                src={`${import.meta.env.VITE_APP_BASE_URL}/${image}`}
                className="lg:h-[500px] sm:h-72 object-cover rounded-md"
              />
            </div>
          </a>
        ))
      ) : (
        <div
          data-interval={3000}
          className="w-2/3 flex items-center justify-center"
        >
          <LazyLoadImage
            src={`${import.meta.env.VITE_APP_BASE_URL}/${images[0]}`}
            className="lg:h-[500px] sm:h-72 object-cover rounded-md"
          />
        </div>
      )}
    </Carousel>
  );
};

export default DetailPageImageSlider;
