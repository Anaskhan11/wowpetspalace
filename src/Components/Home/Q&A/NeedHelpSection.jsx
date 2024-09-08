import React from "react";

const NeedHelpSection = () => {
  return (
    <>
      <div className="row my-3">
        <div className="col-12">
          <div className="container p-5 bg_colour">
            <div className="row g-4">
              <div className="col-md-8 order-2 order-md-1">
                {/* Order of columns changes on different screen sizes */}
                <h4 className="fw-bold">
                  Need help? We’re here to provide a safe start to your lifelong
                  friendship
                </h4>
                <p className="mt-4">
                  We have a bunch of handy articles to answer common questions.
                  Can’t find what you’re looking for? Contact our dedicated
                  trust and safety team.
                </p>
                <div className="row mt-4">
                  <div className="col-md-4 ">
                    <a
                      href
                      type="submit"
                      className="btn custom_btn rounded-pill  text-white p-2 px-3 w-100"
                    >
                      Learn more about pet safety
                    </a>
                  </div>
                  <div className="col-md-4">
                    <a
                      href
                      type="submit"
                      className="btn btn-warning rounded-pill p-2 px-3 mx-2 text-dark d-md-block d-none w-75"
                    >
                      I need help
                    </a>
                    <a
                      href
                      type="submit"
                      className="btn btn-warning rounded-pill p-2 px-3 my-2 text-dark w-100 d-md-none d-block"
                    >
                      I need help
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-4 order-1 order-md-2">
                {/* Order of columns changes on different screen sizes */}
                <div className="container text-center">
                  <img src="./assets/images/help-desk.b9faa0d0ec.svg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NeedHelpSection;
