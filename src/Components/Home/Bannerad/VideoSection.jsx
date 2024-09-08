// libs
import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";

const VideoSection = () => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the observed entry is intersecting, set isInView to true
        if (entry.isIntersecting) {
          setIsInView(true);
          // Optional: Stop observing if you only want to load it once
          observer.disconnect();
        }
      },
      {
        rootMargin: "-50px", // Trigger the callback a bit before the item enters the viewport
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect(); // Cleanup the observer if the component unmounts
  }, []);

  return (
    <main className="w-full bg-black mx-auto">
      <div
        className="w-full flex justify-between lg:flex-nowrap items-center max-[640px]:flex-wrap gap-4 md:flex-wrap sm:flex-wrap max-[1024px]:justify-center"
        ref={ref}
      >
        <div className="p-4 rounded-sm shadow-md lg:w-1/2 md:w-full sm:w-full">
          <h1 className="text-green-600 text-3xl font-bold">About Us</h1>

          <p className="text-slate-200">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
            purus ut libero aliquam facilisis. Sed vel nunc vel libero
            ullamcorper tincidunt. Nullam nec purus ut libero aliquam facilisis.
            Sed vel nunc vel libero ullamcorper tincidunt.
          </p>
        </div>
        {isInView ? (
          <ReactPlayer
            url="https://www.youtube.com/watch?v=TCHq0O5rMcM"
            aspectRatio="1:1"
            playing
            controls
            muted
            loop
          />
        ) : (
          <div>Loading video...</div> // Placeholder while video is not in view
        )}
      </div>
    </main>
  );
};

export default VideoSection;
