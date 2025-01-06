import React from "react";
import Header from "./common/Header";
import Footer from "./common/Footer";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="min-h-screen p-4">{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
