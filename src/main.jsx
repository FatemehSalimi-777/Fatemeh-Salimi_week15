import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastProvider } from "./components/Toast.jsx";
import { ContactProvider } from "./context/ContactContext.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ToastProvider>
			<ContactProvider>
				<App />
			</ContactProvider>
		</ToastProvider>
	</StrictMode>
);
