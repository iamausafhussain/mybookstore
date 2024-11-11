import React from "react";
import { Link } from "react-router-dom";
import BookStoreLogoLight from "../../../assets/BookStoreLogoLight.png"

export const CompanyLogo = () => {

  return (
    <Link to="/" className="flex items-center">
      <img src={BookStoreLogoLight} alt="Company Logo Light" className="self-center sm:max-w-40 " />
    </Link>
  );
};
