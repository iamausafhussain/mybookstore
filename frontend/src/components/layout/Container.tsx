import React from "react";
import { Navbar } from "./Navbar.tsx";
import { Outlet } from "react-router-dom";

export const Container = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
