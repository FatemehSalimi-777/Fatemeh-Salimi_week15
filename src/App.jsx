import { useMemo, useState } from "react";
import AddContact from "./components/AddContact";
import ContactList from "./components/ContactList";
import SearchBar from "./components/SearchBar";
import Modal from "./components/Modal";
import { useToast } from "./components/Toast";

function App() {
	const toast = useToast();
	const [contacts, setContacts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedIds, setSelectedIds] = useState([]);

	const [editingContact, setEditingContact] = useState(null);

	const [modal, setModal] = useState({
		isOpen: false,
		type: null,
		payload: null,
	});

	const addContact = (newContact) => {
		setContacts((prev) => [...prev, { ...newContact, id: Date.now() }]);
	};

	const updateContact = (updatedContact) => {
		setContacts((prev) =>
			prev.map((c) => (c.id === updatedContact.id ? updatedContact : c))
		);
		setEditingContact(null);
	};

	const filteredContacts = useMemo(() => {
		const term = searchTerm.toLowerCase();
		return contacts.filter(
			(c) =>
				c.name.toLowerCase().includes(term) ||
				c.email.toLowerCase().includes(term)
		);
	}, [contacts, searchTerm]);

	const openSingleDelete = (contact) => {
		setModal({ isOpen: true, type: "single", payload: contact });
	};

	const openBulkDelete = () => {
		setModal({ isOpen: true, type: "bulk", payload: selectedIds });
	};

	const confirmDelete = () => {
		if (modal.type === "single" && modal.payload) {
			setContacts((prev) => prev.filter((c) => c.id !== modal.payload.id));
			setSelectedIds((prev) => prev.filter((id) => id !== modal.payload.id));
			toast.addToast("مخاطب با موفقیت حذف شد!", "success");
		}
		if (modal.type === "bulk") {
			setContacts((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
			setSelectedIds([]);
			toast.addToast("مخاطب ها با موفقیت حذف شدند!", "success");
		}
		setModal({ isOpen: false, type: null, payload: null });
	};

	const toggleSelect = (id) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		);
	};

	const toggleSelectAll = (checked) => {
		if (checked) {
			setSelectedIds(filteredContacts.map((c) => c.id));
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

			<AddContact
				onAdd={addContact}
				onUpdate={updateContact}
				editData={editingContact}
				onCancel={handleCancelEdit}
			/>

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
