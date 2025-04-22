import PropTypes from "prop-types";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="w-full mx-auto bg-white">
      {/* Tab headers */}
      <div className="flex border-b-2 border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium border-b-4 focus:outline-none transition-all ${
              activeTab === tab.id
                ? "text-black font-medium border-b-4 border-orange-500"
                : "text-gray-600 border-transparent hover:text-black hover:font-medium"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};
