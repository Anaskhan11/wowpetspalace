// Libs
import React from "react";
import { LazyLoadImage } from "react-lazyload-image-component";

const BannerAdd = () => {
  return (
    <>
      {" "}
      <div className="row">
        <div className="col-12">
          <div className="container">
            <div className="card mb-3 w-100 border-0">
              <div className="row g-0">
                <div className="col-md-4">
                  <LazyLoadImage
                    src="./assets/images/add banner.png"
                    className="img-fluid rounded-start"
                    alt="..."
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">
                      Find Out Why You Should Get Pet Insurance
                    </h5>
                    <p className="card-text">
                      Pet insurance helps you to pay for vet bills, medication
                      and treatments when your pet is unwell or injured.
                    </p>
                    <hr />
                    <div className="d-flex">
                      <p className="card-text">
                        <small className="text-body-secondary">
                          Retrieve a Quote
                        </small>
                      </p>
                      <small className="custom_btn ms-auto text-white rounded p-2">
                        Sponsored by ManyPets Pet Insurance
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BannerAdd;
