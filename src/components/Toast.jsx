import React, { createContext, useState, useContext, useCallback } from "react";
import styles from "./Toast.module.css";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
	const [toasts, setToasts] = useState([]);

	const addToast = useCallback((message, type = "success") => {
		const id = Date.now();
		const newToast = { id, message, type };

		setToasts((prev) => [...prev, newToast]);

		setTimeout(() => {
			removeToast(id);
		}, 3000);
	}, []);

	const removeToast = (id) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	};

	return (
		<ToastContext.Provider value={{ addToast }}>
			{children}

			<div className={styles.toastContainer}>
				{toasts.map((toast) => (
					<div
						key={toast.id}
						className={`${styles.toast} ${styles[toast.type]}`}>
						{toast.message}
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
};

export const useToast = () => useContext(ToastContext);
