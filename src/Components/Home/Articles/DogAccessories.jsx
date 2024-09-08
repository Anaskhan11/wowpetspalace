import React from "react";

const DogAccessories = () => {
  return (
    <>
      <div className="row my-4 mx-md-0 mx-3">
        <div className="col-12 text-center">
          <a
            href
            type="submit"
            className="btn custom_btn rounded-pill  text-white p-2 px-3 "
          >
            View All Articles
          </a>
          <div className="container d-flex justify-content-between align-items-center">
            <h4 className="fw-bold my-3">
              Essential Dog Accessories &amp; Supplies
            </h4>
            <a
              href
              className="mt-2 fw-bolder text_color_primary text-decoration-none"
            >
              Search
            </a>
          </div>
          <div className="container">
            <div className="card-container img-margin">
              <div className="card border-0">
                <div className="image-container">
                  <img
                    loading="lazy"
                    src="./assets/images/Dog Accessories .webp"
                    className="card-img"
                    alt="..."
                  />
                </div>
                <div className="card-body">
                  <h6 className="card-title fw-bolder"> Training Tools</h6>
                </div>
              </div>
              <div className="card border-0">
                <div className="image-container">
                  <img
                    loading="lazy"
                    src="./assets/images/Dog Accessories .webp"
                    className="card-img"
                    alt="..."
                  />
                </div>
                <div className="card-body">
                  <h6 className="card-title fw-bolder"> Training Tools</h6>
                </div>
              </div>
              <div className="card border-0">
                <div className="image-container">
                  <img
                    src="./assets/images/Dog Accessories .webp"
                    className="card-img"
                    alt="..."
                  />
                </div>
                <div className="card-body">
                  <h6 className="card-title fw-bolder"> Training Tools</h6>
                </div>
              </div>
              <div className="card border-0">
                <div className="image-container">
                  <img
                    src="./assets/images/Dog Accessories .webp"
                    className="card-img"
                    alt="..."
                  />
                </div>
                <div className="card-body">
                  <h6 className="card-title fw-bolder"> Training Tools</h6>
                </div>
              </div>
              <div className="card border-0">
                <div className="image-container">
                  <img
                    src="./assets/images/caring-for-a-ragdoll-cat-.webp"
                    className="card-img"
                    alt="..."
                  />
                </div>
                <div className="card-body">
                  <h6 className="card-title fw-bolder"> Training Tools</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DogAccessories;
