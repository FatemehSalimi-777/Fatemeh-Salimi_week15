import { useEffect, useState } from "react";
import styles from "./AddContact.module.css";
import { useToast } from "./Toast";
import { useContacts } from "../context/ContactContext";

const emptyForm = {
	name: "",
	email: "",
	phone: "",
};

const AddContact = ({ editData, onCancel }) => {
	const toast = useToast();
	const { addContact, updateContact } = useContacts();

	const [formData, setFormData] = useState(emptyForm);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (editData) {
			setFormData({
				name: editData.name ?? "",
				email: editData.email ?? "",
				phone: editData.phone ?? "",
			});
		} else {
			setFormData(emptyForm);
		}

		setErrors({});
	}, [editData]);

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		setErrors((prev) => ({
			...prev,
			[name]: "",
		}));
	};

	const validate = () => {
		const newErrors = {};

		if (formData.name.trim().length < 3) {
			newErrors.name = "نام باید حداقل ۳ حرف باشد";
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(formData.email.trim())) {
			newErrors.email = "ایمیل نامعتبر است";
		}

		const phoneRegex = /^[0-9]{10,15}$/;

		if (!phoneRegex.test(formData.phone.trim())) {
			newErrors.phone = "شماره تماس باید بین ۱۰ تا ۱۵ رقم باشد";
		}

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	const resetForm = () => {
		setFormData(emptyForm);
		setErrors({});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validate() || isSubmitting) return;

		setIsSubmitting(true);

		try {
			const contactData = {
				name: formData.name.trim(),
				email: formData.email.trim(),
				phone: formData.phone.trim(),
			};

			if (editData) {
				await updateContact({
					...contactData,
					id: editData.id,
				});

				toast.addToast("تغییرات با موفقیت ذخیره شد", "success");

				resetForm();

				onCancel?.();
			} else {
				await addContact(contactData);

				toast.addToast("مخاطب جدید اضافه شد", "success");

				resetForm();
			}
		} catch (error) {
			console.error("Submit contact error:", error);

			toast.addToast(
				editData ? "ویرایش مخاطب انجام نشد" : "افزودن مخاطب انجام نشد",
				"error"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit} noValidate>
			<h2 className={styles.title}>
				{editData ? "ویرایش مخاطب" : "افزودن مخاطب جدید"}
			</h2>

			<div className={styles.inputGroup}>
				<input
					name="name"
					type="text"
					placeholder="نام و نام خانوادگی"
					className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
					value={formData.name}
					onChange={handleChange}
					disabled={isSubmitting}
				/>

				{errors.name && <span className={styles.errorText}>{errors.name}</span>}
			</div>

			<div className={styles.inputGroup}>
				<input
					name="email"
					type="email"
					placeholder="ایمیل"
					className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
					value={formData.email}
					onChange={handleChange}
					disabled={isSubmitting}
				/>

				{errors.email && (
					<span className={styles.errorText}>{errors.email}</span>
				)}
			</div>

			<div className={styles.inputGroup}>
				<input
					name="phone"
					type="text"
					placeholder="شماره تماس"
					className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
					value={formData.phone}
					onChange={handleChange}
					disabled={isSubmitting}
				/>

				{errors.phone && (
					<span className={styles.errorText}>{errors.phone}</span>
				)}
			</div>

			<button
				type="submit"
				className={styles.submitBtn}
				disabled={isSubmitting}>
				{isSubmitting
					? "در حال ذخیره..."
					: editData
					? "ذخیره تغییرات"
					: "افزودن به لیست"}
			</button>

			{editData && (
				<button
					type="button"
					className={styles.cancelBtn}
					onClick={() => {
						resetForm();
						onCancel?.();
					}}
					disabled={isSubmitting}>
					انصراف از ویرایش
				</button>
			)}
		</form>
	);
};

export default AddContact;
