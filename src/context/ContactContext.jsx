import { createContext, useContext, useEffect, useReducer } from "react";
import api from "../services/api";
import { contactReducer } from "./ContactReducer";

const ContactContext = createContext();

const initialState = {
	contacts: [],
};

export const ContactProvider = ({ children }) => {
	const [state, dispatch] = useReducer(contactReducer, initialState);

	useEffect(() => {
		fetchContacts();
	}, []);

	const fetchContacts = async () => {
		const { data } = await api.get("/contacts");
		// console.log("Data from API:", data);

		dispatch({
			type: "SET_CONTACTS",
			payload: data,
		});
	};

	const addContact = async (contact) => {
		const { data } = await api.post("/contacts", contact);

		dispatch({
			type: "ADD_CONTACT",
			payload: data,
		});
	};

	const updateContact = async (contact) => {
		const { data } = await api.put(`/contacts/${contact.id}`, contact);

		dispatch({
			type: "UPDATE_CONTACT",
			payload: data,
		});
	};

	const deleteContact = async (id) => {
		await api.delete(`/contacts/${id}`);

		dispatch({
			type: "DELETE_CONTACT",
			payload: id,
		});
	};

	const deleteManyContacts = async (ids) => {
		await Promise.all(ids.map((id) => api.delete(`/contacts/${id}`)));

		dispatch({
			type: "DELETE_MANY_CONTACTS",
			payload: ids,
		});
	};

	return (
		<ContactContext.Provider
			value={{
				contacts: state.contacts,
				addContact,
				updateContact,
				deleteContact,
				deleteManyContacts,
			}}>
			{children}
		</ContactContext.Provider>
	);
};

export const useContacts = () => useContext(ContactContext);
