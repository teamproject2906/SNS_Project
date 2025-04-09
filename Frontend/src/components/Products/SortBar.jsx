import { useState } from 'react';
import styles from '../../assets/styles/SortBar.module.css'; // Import CSS module

const SortBar = ({ onSort, selectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { label: 'Giá: Tăng dần', value: 'price-asc' },
    { label: 'Giá: Giảm dần', value: 'price-desc' },
    { label: 'Tên: A-Z', value: 'name-asc' },
    { label: 'Tên: Z-A', value: 'name-desc' },
    { label: 'Cũ nhất', value: 'oldest' },
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Bán chạy nhất', value: 'best-selling' },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setIsOpen(false);
    onSort(option); // Trigger sorting in parent
  };

  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.dropdownHeader} onClick={toggleDropdown}>
        {selectedOption} <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
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