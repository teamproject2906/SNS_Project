import { useState } from "react";
import styles from "../../assets/styles/SortBar.module.css";

const SortBar = ({ onSort, selectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { label: "Price: Ascending", value: "price-asc" },
    { label: "Price: Descending", value: "price-desc" },
    { label: "Name: A-Z", value: "name-asc" },
    { label: "Name: Z-A", value: "name-desc" },
    { label: "Oldest Products", value: "oldest" },
    { label: "Latest Products", value: "newest" },
    // { label: "Bán chạy nhất", value: "best-selling" },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    console.log("Selected option:", option);
    setIsOpen(false);
    onSort(option);
  };

  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.dropdownHeader} onClick={toggleDropdown}>
        {selectedOption} <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {options.map((option, index) => (
            <li
              key={index}
              className={styles.dropdownItem}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortBar;