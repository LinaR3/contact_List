export const initialStore = () => ({
  contacts: { clients: [], employees: [], providers: [] },
  isLoading: false,
  error: null,
  activeTab: "clients",
});

export default function storeReducer(store, action) {
  switch (action.type) {

    case "SET_LOADING":
      return { ...store, isLoading: action.payload };

    case "SET_ERROR":
      return { ...store, error: action.payload };

    case "SET_CONTACTS":
      return {
        ...store,
        isLoading: false,
        contacts: {
          ...store.contacts,
          [action.tab]: action.payload,
        },
      };

    case "SET_ACTIVE_TAB":
      return { ...store, activeTab: action.payload };

    default:
      throw new Error("Unknown action: " + action.type);
  }
}