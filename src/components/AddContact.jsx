import { useState, useEffect } from "react";
import styles from "./AddContact.module.css";
import { useToast } from "./Toast";

const AddContact = ({ onAdd, onUpdate, editData, onCancel }) => {
	const toast = useToast();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
	});
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (editData) {
			setFormData({
				name: editData.name,
				email: editData.email,
				phone: editData.phone,
			});
		} else {
			setFormData({ name: "", email: "", phone: "" });
		}
		setErrors({});
	}, [editData]);

	const validate = () => {
		const newErrors = {};
		if (formData.name.trim().length < 3)
			newErrors.name = "نام باید حداقل ۳ حرف باشد";

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) newErrors.email = "ایمیل نامعتبر است";

		const phoneRegex = /^[0-9]{10,15}$/;
		if (!phoneRegex.test(formData.phone))
			newErrors.phone = "شماره تماس نامعتبر است";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validate()) {
			toast.addToast("اطلاعات نامعتبر است!", "error");
			return;
		}

		if (editData) {
			onUpdate({ ...formData, id: editData.id });
			toast.addToast("تغییرات با موفقیت ذخیره شد", "success");
		} else {
			onAdd(formData);
			toast.addToast("مخاطب جدید اضافه شد", "success");
		}
		setFormData({ name: "", email: "", phone: "" });
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<h2 className={styles.title}>
				{editData ? "ویرایش مخاطب" : "افزودن مخاطب جدید"}
			</h2>

			<div className={styles.inputGroup}>
				<input
					type="text"
					placeholder="نام و نام خانوادگی"
					className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
				/>
				{errors.name && <span className={styles.errorText}>{errors.name}</span>}
			</div>

			<div className={styles.inputGroup}>
				<input
					type="email"
					placeholder="ایمیل"
					className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
					value={formData.email}
					onChange={(e) => setFormData({ ...formData, email: e.target.value })}
				/>
				{errors.email && (
					<span className={styles.errorText}>{errors.email}</span>
				)}
			</div>

			<div className={styles.inputGroup}>
				<input
					type="text"
					placeholder="شماره تماس"
					className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
					value={formData.phone}
					onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
				/>
				{errors.phone && (
					<span className={styles.errorText}>{errors.phone}</span>
				)}
			</div>

			<button type="submit" className={styles.submitBtn}>
				{editData ? "ذخیره تغییرات" : "افزودن به لیست"}
			</button>

			{editData && (
				<button
					type="button"
					className={styles.cancelBtn}
					onClick={() => {
						setFormData({ name: "", email: "", phone: "" });
						onCancel();
					}}>
					انصراف از ویرایش
				</button>
			)}
		</form>
	);
};

export default AddContact;
