import Header from "./common/Header";
import Footer from "./common/Footer";
import PropTypes from "prop-types";

const MainLayout = ({ children, className }) => {
  return (
    <>
      <Header />
      <main className={`min-h-screen p-4 ${className}`}>{children}</main>
      <Footer />
    </>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default MainLayout;
