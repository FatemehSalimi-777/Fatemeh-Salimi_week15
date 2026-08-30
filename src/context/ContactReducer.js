export const contactReducer = (state, action) => {
	switch (action.type) {
		case "SET_CONTACTS":
			return {
				...state,
				contacts: action.payload,
			};

		case "ADD_CONTACT":
			return {
				...state,
				contacts: [...state.contacts, action.payload],
			};

		case "UPDATE_CONTACT":
			return {
				...state,
				contacts: state.contacts.map((contact) =>
					contact.id === action.payload.id ? action.payload : contact
				),
			};

		case "DELETE_CONTACT":
			return {
				...state,
				contacts: state.contacts.filter(
					(contact) => contact.id !== action.payload
				),
			};

		case "DELETE_MANY_CONTACTS":
			return {
				...state,
				contacts: state.contacts.filter(
					(contact) => !action.payload.includes(contact.id)
				),
			};

		default:
			return state;
	}
};
