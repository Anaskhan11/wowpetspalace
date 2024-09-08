import React from "react";
import logo from "../../../public/logo-1.svg";
import { Link } from "react-router-dom";

import { FaFacebook } from "react-icons/fa6";
import { PiInstagramLogoFill } from "react-icons/pi";

const Footer = () => {
  return (
    <>
      <footer className="bg-[#042615] p-4">
        <div className="text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              <img
                src={logo}
                className="text-white h-12 w-auto"
                alt="company logo"
              />
              <div className="flex flex-wrap items-center gap-4 self-start mt-3 font-semibold">
                <Link to="/contact-us">CONTACT US</Link>

                <Link
                  to="/terms-and-conditions"
                  className="text-white uppercase"
                >
                  Terms and Conditions
                </Link>
                <Link to="/privacy-policy" className="text-white uppercase">
                  Privacy Policy Updated
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaFacebook className="h-8 w-8" />
              <PiInstagramLogoFill className="h-8 w-8" />
            </div>
          </div>

          {/* Footer Links goes below*/}
          <ul className="my-4 w-full text-center">
            <p className="text-sm">
              WowPetsPalace is the most popular pet site. Buy puppies online
              from trusted breeders, ethically sell puppies and adopt dogs,
              kittens and cats safely
            </p>
          </ul>
          <div>
            <p className="text-center text-sm">
              © 2024 WowPetsPalace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
