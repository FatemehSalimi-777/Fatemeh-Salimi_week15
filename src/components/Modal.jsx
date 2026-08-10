import styles from "./Modal.module.css";

const Modal = ({ isOpen, title, message, onConfirm, onCancel }) => {
	if (!isOpen) return null;

	return (
		<div className={styles.overlay} onClick={onCancel}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<h3 className={styles.title}>{title}</h3>
				<p className={styles.message}>{message}</p>

				<div className={styles.actions}>
					<button className={styles.cancelBtn} onClick={onCancel}>
						انصراف
					</button>
					<button className={styles.confirmBtn} onClick={onConfirm}>
						تایید حذف
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;
