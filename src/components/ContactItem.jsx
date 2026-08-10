import styles from "./ContactItem.module.css";

const getInitials = (name) => {
	if (!name) return "?";
	return name
		.trim()
		.split(" ")
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();
};

const ContactItem = ({
	contact,
	onDeleteRequest,
	onEdit,
	isSelected,
	onToggleSelect,
}) => {
	return (
		<li className={styles.card}>
			<label className={styles.checkboxWrap}>
				<input
					type="checkbox"
					checked={isSelected}
					onChange={() => onToggleSelect(contact.id)}
				/>
			</label>

			<div className={styles.avatar}>{getInitials(contact.name)}</div>

			<div className={styles.info}>
				<h3 className={styles.name}>{contact.name}</h3>
				<p className={styles.detail}>{contact.email}</p>
				<p className={styles.detail}>{contact.phone}</p>
			</div>

			<div className={styles.actions}>
				<button
					type="button"
					className={styles.editBtn}
					onClick={() => onEdit(contact)}>
					ویرایش
				</button>
				<button
					type="button"
					className={styles.deleteBtn}
					onClick={() => onDeleteRequest(contact)}>
					حذف
				</button>
			</div>
		</li>
	);
};

export default ContactItem;
