import React from "react";
import { useLocation } from "react-router-dom";

// icons
import { FaLocationDot } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const AdvertisementDetailsPage = () => {
  const location = useLocation();
  const { data } = location.state;
  console.log(data);

  return (
    <div className="midde_cont">
      <div className="container-fluid">
        <div className="row column_title">
          <div className="col-md-12">
            <div className="page_title">
              <h2>Advertisement Detail</h2>
            </div>
          </div>
        </div>
        <div className="row column1">
          <div className="col-md-12">
            <div className="white_shd full margin_bottom_30">
              <div className="full graph_head flex-col items-center justify-between">
                <img
                  className="w-full h-60 object-cover rounded-md shadow-md sm:h-96"
                  src={`${import.meta.env.VITE_APP_BASE_URL}/${
                    data.imagePaths[0]
                  }`}
                  alt="image of advertisement"
                />
                <h2 className="text-6xl tracking-wide font-bold text-green-800 my-4">
                  {data.title.toUpperCase()}
                </h2>
                <span className="text-md font-bold text-lg text-white bg-green-600 rounded-md px-2 py-1">
                  {data.category_title}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="my-2 ">
                    <span className="flex items-center gap-2 py-1 px-2 rounded-md bg-green-600 font-semibold text-lg text-slate-700 mr-2">
                      <FaLocationDot className="h-6 w-6 text-white" />
                      <span className="text-white font-bold">
                        {data.address}
                      </span>
                    </span>
                  </p>
                  <p className="my-2 ">
                    <span className="flex items-center gap-2 py-1 px-2 rounded-md bg-green-600 font-semibold text-lg text-slate-700 mr-2">
                      <FaEye className="h-6 w-6 text-white" />

                      <span className="text-white font-bold">{data.views}</span>
                    </span>
                  </p>
                  <p className="my-2 ">
                    <span className="flex items-center gap-2 py-1 px-2 rounded-md bg-green-600 font-semibold text-xl text-slate-700 mr-2">
                      <MdVerified className="h-6 w-6 text-white" />

                      <span className="text-white font-bold">
                        {data.verified === 1 ? "Yes" : "No"}
                      </span>
                    </span>
                  </p>
                </div>
                <p className="leading-10 tracking-wide font-md text-2xl text-slate-700">
                  {data.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementDetailsPage;
