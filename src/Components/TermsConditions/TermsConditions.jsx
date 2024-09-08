// Libs
import React, { useState, useEffect } from "react";
import Style from "./Terms.module.css";
import axios from "axios";

const TermsConditions = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    const fetchTermsConditions = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/privacyAndTermRoutes/getTerm/`
      );
      setList(response.data.result);
    };
    fetchTermsConditions();
  }, []);
  return (
    <main className="">
      <div className="privacy-image flex items-center justify-center">
        <h2 className="text-5xl font-bold text-white">Terms and Conditions</h2>
      </div>
      <div className={`max-w-3xl mx-auto my-8 ${Style.myContent}`}>
        {list.map((item, index) => (
          <>
            <p className="font-semibold bg-slate-50 px-2 py-1 rounded-md w-fit shadow shadow-sm shadow-gray-200">
              Last Update: {item.created_at.split("T")[0]}
            </p>
            <h1 className="text-slate-700 border-b pb-2 border-b-slate-500 text-2xl font-bold">
              {item.title}
            </h1>
            <div
              className={Style.h1}
              dangerouslySetInnerHTML={{ __html: item.description }}
            ></div>
          </>
        ))}
      </div>
    </main>
  );
};

export default TermsConditions;
