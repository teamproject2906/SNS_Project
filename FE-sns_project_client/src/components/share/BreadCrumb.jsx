import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="flex mb-10" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-500 flex items-center"
          >
            <span className="mr-5">HOME</span>
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.293 2.707a1 1 0 011.414 0l7 7a1 1 0 010 1.414l-7 7a1 1 0 11-1.414-1.414L13.586 10 7.293 3.707a1 1 0 010-1.414z"
              />
            </svg>
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`.replace(
            "//",
            "/"
          );
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <li key={name} className="pl-2 text-gray-400" aria-current="page">
              {name.toLocaleUpperCase()}
            </li>
          ) : (
            <li key={name}>
              <div className="flex items-center  text-gray-400 hover:text-gray-500">
                <Link
                  to={routeTo}
                  className="mr-5 md:ml-2"
                >
                  {name.toLocaleUpperCase()}
                </Link>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.293 2.707a1 1 0 011.414 0l7 7a1 1 0 010 1.414l-7 7a1 1 0 11-1.414-1.414L13.586 10 7.293 3.707a1 1 0 010-1.414z"
                  />
                </svg>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
