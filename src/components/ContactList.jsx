import styles from "./ContactList.module.css";
import ContactItem from "./ContactItem";

const ContactList = ({
	contacts,
	onDeleteRequest,
	onEdit,
	selectedIds,
	onToggleSelect,
	onToggleSelectAll,
	onBulkDeleteRequest,
}) => {
	const allSelected =
		contacts.length > 0 && contacts.every((c) => selectedIds.includes(c.id));

	if (!contacts.length) {
		return (
			<div className={styles.emptyState}>
				<h3>هیچ مخاطبی پیدا نشد</h3>
				<p>یا هنوز مخاطبی اضافه نکرده‌ای، یا نتیجه جستجو خالی است.</p>
			</div>
		);
	}

	return (
		<section className={styles.wrapper}>
			<div className={styles.header}>
				<h2 className={styles.title}>لیست مخاطبین</h2>
				<span className={styles.count}>{contacts.length} مخاطب</span>
			</div>

			<div className={styles.toolbar}>
				<label className={styles.selectAll}>
					<input
						type="checkbox"
						checked={allSelected}
						onChange={(e) => onToggleSelectAll(e.target.checked)}
					/>
					<span>انتخاب همه</span>
				</label>

				{selectedIds.length > 0 && (
					<button
						className={styles.bulkDeleteBtn}
						onClick={onBulkDeleteRequest}>
						حذف انتخاب‌ شده‌ها ({selectedIds.length})
					</button>
				)}
			</div>

			<ul className={styles.list}>
				{contacts.map((contact) => (
					<ContactItem
						key={contact.id}
						contact={contact}
						onDeleteRequest={onDeleteRequest}
						onEdit={onEdit}
						isSelected={selectedIds.includes(contact.id)}
						onToggleSelect={onToggleSelect}
					/>
				))}
			</ul>
		</section>
	);
};

export default ContactList;
