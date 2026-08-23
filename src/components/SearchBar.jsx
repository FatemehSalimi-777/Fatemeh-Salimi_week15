import styles from "./SearchBar.module.css";

const SearchBar = ({ searchTerm, onSearch }) => {
	return (
		<div className={styles.wrapper}>
			<input
				type="text"
				placeholder="جستجوی مخاطب (نام یا ایمیل یا شماره تماس)..."
				className={styles.input}
				value={searchTerm}
				onChange={(e) => onSearch(e.target.value)}
			/>
		</div>
	);
};

export default SearchBar;
