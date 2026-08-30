import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "./AddContact.module.css";
import { useToast } from "./Toast";
import { useContacts } from "../context/ContactContext";

// yup schema
const contactSchema = yup
	.object({
		name: yup
			.string()
			.trim()
			.required("نام و نام خانوادگی الزامی است")
			.min(3, "نام باید حداقل ۳ حرف باشد"),
		email: yup
			.string()
			.trim()
			.required("ایمیل الزامی است")
			.email("ایمیل نامعتبر است"),
		phone: yup
			.string()
			.trim()
			.required("شماره تماس الزامی است")
			.matches(/^[0-9]{11,15}$/, "شماره تماس باید بین ۱۰ تا ۱۵ رقم باشد"),
	})
	.required();

const AddContact = ({ editData, onCancel }) => {
	const toast = useToast();
	const { addContact, updateContact } = useContacts();

	//yup resolver combined with react-hook-form
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: yupResolver(contactSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
		},
	});

	useEffect(() => {
		if (editData) {
			reset({
				name: editData.name ?? "",
				email: editData.email ?? "",
				phone: editData.phone ?? "",
			});
		} else {
			reset({
				name: "",
				email: "",
				phone: "",
			});
		}
	}, [editData, reset]);

	const onSubmit = async (data) => {
		try {
			const contactData = {
				name: data.name.trim(),
				email: data.email.trim(),
				phone: data.phone.trim(),
			};

			if (editData) {
				await updateContact({
					...contactData,
					id: editData.id,
				});

				toast.addToast("تغییرات با موفقیت ذخیره شد", "success");

				reset({ name: "", email: "", phone: "" });
				onCancel?.();
			} else {
				await addContact(contactData);
				toast.addToast("مخاطب جدید اضافه شد", "success");

				reset({ name: "", email: "", phone: "" });
			}
		} catch (error) {
			console.error("Submit contact error:", error);
			toast.addToast(
				editData ? "ویرایش مخاطب انجام نشد" : "افزودن مخاطب انجام نشد",
				"error"
			);
		}
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
			<h2 className={styles.title}>
				{editData ? "ویرایش مخاطب" : "افزودن مخاطب جدید"}
			</h2>

			<div className={styles.inputGroup}>
				<input
					{...register("name")}
					type="text"
					placeholder="نام و نام خانوادگی"
					className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
					disabled={isSubmitting}
				/>
				{errors.name && (
					<span className={styles.errorText}>{errors.name.message}</span>
				)}
			</div>

			<div className={styles.inputGroup}>
				<input
					{...register("email")}
					type="email"
					placeholder="ایمیل"
					className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
					disabled={isSubmitting}
				/>
				{errors.email && (
					<span className={styles.errorText}>{errors.email.message}</span>
				)}
			</div>

			<div className={styles.inputGroup}>
				<input
					{...register("phone")}
					type="text"
					placeholder="شماره تماس"
					className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
					disabled={isSubmitting}
				/>
				{errors.phone && (
					<span className={styles.errorText}>{errors.phone.message}</span>
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
						reset({ name: "", email: "", phone: "" });
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
