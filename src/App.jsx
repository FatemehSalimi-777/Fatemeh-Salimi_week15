import { useMemo, useState } from "react";
import AddContact from "./components/AddContact";
import ContactList from "./components/ContactList";
import SearchBar from "./components/SearchBar";
import Modal from "./components/Modal";
import { useToast } from "./components/Toast";
import { useContacts } from "./context/ContactContext";

function App() {
	const toast = useToast();
	const { contacts, deleteContact, deleteManyContacts } = useContacts();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedIds, setSelectedIds] = useState([]);

	const [editingContact, setEditingContact] = useState(null);

	const [modal, setModal] = useState({
		isOpen: false,
		type: null,
		payload: null,
	});

	const filteredContacts = useMemo(() => {
		const contactList = Array.isArray(contacts) ? contacts : [];
		const term = searchTerm.trim().toLowerCase();

		return contactList.filter((contact) => {
			const name = contact.name?.toLowerCase() || "";
			const email = contact.email?.toLowerCase() || "";
			const phone = contact.phone?.toLowerCase() || "";

			return (
				name.includes(term) || email.includes(term) || phone.includes(term)
			);
		});
	}, [contacts, searchTerm]);

	const openSingleDelete = (contact) => {
		setModal({ isOpen: true, type: "single", payload: contact });
	};

	const openBulkDelete = () => {
		setModal({ isOpen: true, type: "bulk", payload: selectedIds });
	};

	const confirmDelete = async () => {
		if (!modal.isOpen) return;

		try {
			if (modal.type === "single" && modal.payload) {
				await deleteContact(modal.payload.id);

				setSelectedIds((prev) => prev.filter((id) => id !== modal.payload.id));
				toast.addToast("مخاطب با موفقیت حذف شد!", "success");
			} else if (modal.type === "bulk" && selectedIds.length > 0) {
				await deleteManyContacts(selectedIds);

				setSelectedIds([]);
				toast.addToast(
					`${selectedIds.length} مخاطب با موفقیت حذف شدند!`,
					"success"
				);
			}
		} catch (error) {
			console.error("Error during deletion:", error);
			toast.addToast("خطا در حذف مخاطبان!", "error");
		} finally {
			setModal({ isOpen: false, type: null, payload: null });
		}
	};

	const toggleSelect = (id) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		);
	};

	const toggleSelectAll = (checked) => {
		if (checked) {
			const allFilteredIds = filteredContacts.map((c) => c.id);
			setSelectedIds(allFilteredIds);
		} else {
			setSelectedIds([]);
		}
	};

	const startEditing = (contact) => {
		setEditingContact(contact);

		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleCancelEdit = () => {
		setEditingContact(null);
	};

	return (
		<div style={{ padding: "2rem", background: "#f8fafc", minHeight: "100vh" }}>
			<h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
				مدیریت مخاطبین
			</h1>

			<AddContact editData={editingContact} onCancel={handleCancelEdit} />

			<SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />

			<ContactList
				contacts={filteredContacts}
				onDeleteRequest={openSingleDelete}
				onEdit={startEditing}
				selectedIds={selectedIds}
				onToggleSelect={toggleSelect}
				onToggleSelectAll={toggleSelectAll}
				onBulkDeleteRequest={openBulkDelete}
			/>

			<Modal
				isOpen={modal.isOpen}
				title={modal.type === "bulk" ? "حذف گروهی" : "حذف مخاطب"}
				message={
					modal.type === "bulk"
						? `آیا مطمئن هستی می‌خواهی ${selectedIds.length} مخاطب انتخاب‌شده را حذف کنی؟`
						: `آیا مطمئن هستی می‌خواهی "${modal.payload?.name}" را حذف کنی؟`
				}
				onConfirm={confirmDelete}
				onCancel={() => setModal({ isOpen: false, type: null, payload: null })}
			/>
		</div>
	);
}

export default App;
