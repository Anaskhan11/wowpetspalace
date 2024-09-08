// Libs
import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ImageSlider = ({ images }) => {
  const [intervalz, setIntervalz] = useState(3000);

  const onChange = (index, item) => {
    setIntervalz(item.props["data-interval"]);
  };

  const filteredImages = images.filter((image) => {
    const expiryDate = new Date(image.expiryDate);
    const currentDate = new Date();
    return expiryDate > currentDate || image.defaultSlider === 1;
  });

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
    >
      {filteredImages.length >= 1 ? (
        filteredImages.slice(0, 3).map((image, index) => (
          <a
            className="cursor-pointer"
            // href={`${import.meta.env.VITE_APP_BASE_URL}/${image.images}`}
            href={image.url}
            target="_blank"
          >
            <div data-interval={3000} key={index}>
              <LazyLoadImage
                src={`${import.meta.env.VITE_APP_BASE_URL}/${image.images}`}
                className="lg:h-[650px] sm:h-72 object-cover object-center rounded-md"
              />
            </div>
          </a>
        ))
      ) : (
        <div data-interval={3000}>
          <LazyLoadImage
            src={`${import.meta.env.VITE_APP_BASE_URL}/${images[0]}`}
            className="lg:h-[650px] sm:h-72 object-cover rounded-md"
          />
        </div>
      )}
    </Carousel>
  );
};

export default ImageSlider;
