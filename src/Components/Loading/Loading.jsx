import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Skeleton width={200} height={200} style={{ marginRight: "20px" }} />
      <Skeleton width={200} height={200} style={{ marginRight: "20px" }} />
      <Skeleton width={200} height={200} />
    </div>
  );
};

export default Loading;
