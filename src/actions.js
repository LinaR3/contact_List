const BASE = import.meta.env.VITE_API_BASE;

export const SLUGS = {
  clients:   import.meta.env.VITE_SLUG_CLIENTS,
  employees: import.meta.env.VITE_SLUG_EMPLOYEES,
  providers: import.meta.env.VITE_SLUG_PROVIDERS,
};

// Se asegura que la agenda exista antes de usarla
const ensureAgenda = async (tab) => {
  await fetch(`${BASE}/agendas/${SLUGS[tab]}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug: SLUGS[tab] }),
  });
};

// GET — traer todos los contactos de un tab
export const getContacts = async (dispatch, tab) => {
  dispatch({ type: "SET_LOADING", payload: true });
  try {
    await ensureAgenda(tab);
    const res = await fetch(`${BASE}/agendas/${SLUGS[tab]}/contacts`);
    if (!res.ok) throw new Error("Error fetching contacts");
    const data = await res.json();
    dispatch({
      type: "SET_CONTACTS",
      tab,
      payload: Array.isArray(data.contacts) ? data.contacts : [],
    });
  } catch (e) {
    dispatch({ type: "SET_ERROR", payload: e.message });
    dispatch({ type: "SET_LOADING", payload: false });
  }
};

// POST — crear un contacto nuevo
export const createContact = async (dispatch, tab, contactData) => {
  try {
    const res = await fetch(`${BASE}/agendas/${SLUGS[tab]}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    });
    if (!res.ok) throw new Error("Error creating contact");
    await getContacts(dispatch, tab);
    return true;
  } catch (e) {
    dispatch({ type: "SET_ERROR", payload: e.message });
    return false;
  }
};

// PUT — editar un contacto existente
export const updateContact = async (dispatch, tab, id, contactData) => {
  try {
    const res = await fetch(`${BASE}/agendas/${SLUGS[tab]}/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    });
    if (!res.ok) throw new Error("Error updating contact");
    await getContacts(dispatch, tab);
    return true;
  } catch (e) {
    dispatch({ type: "SET_ERROR", payload: e.message });
    return false;
  }
};

// DELETE — borrar un contacto
export const deleteContact = async (dispatch, tab, id) => {
  try {
    const res = await fetch(`${BASE}/agendas/${SLUGS[tab]}/contacts/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error deleting contact");
    await getContacts(dispatch, tab);
    return true;
  } catch (e) {
    dispatch({ type: "SET_ERROR", payload: e.message });
    return false;
  }
};