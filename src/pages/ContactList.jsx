import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getContacts, deleteContact } from "../actions";
import ContactCard from "../components/ContactCard";
import { useNavigate } from "react-router-dom";

const TABS = [
  { key: "clients",   label: "Clients" },
  { key: "employees", label: "Employees" },
  { key: "providers", label: "Providers" },
];

export default function ContactList() {
  const { store, dispatch } = useGlobalReducer();
  const { contacts, isLoading, error, activeTab } = store;
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [contactToDelete, setContactToDelete] = useState(null);

  // Cada vez que cambia el tab, carga los contactos de ese tab
  useEffect(() => {
    getContacts(dispatch, activeTab);
  }, [activeTab]);

  // Filtra por nombre o email según lo que escribas en el buscador
  const filtered = (contacts[activeTab] || []).filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Ejecuta el borrado cuando confirman en el modal
  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;
    await deleteContact(dispatch, activeTab, contactToDelete.id);
    setContactToDelete(null);
  };

  return (
    <div className="contact-list-page">

      {/* Header */}
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-title">PeopleBase</h1>
          <p className="page-subtitle">Your business contacts, organized.</p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate("/add")}>
          + Add contact
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? "tab--active" : ""}`}
            onClick={() => dispatch({ type: "SET_ACTIVE_TAB", payload: tab.key })}
          >
            {tab.label}
            <span className="tab__count">
              {contacts[tab.key]?.length || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Buscador */}
      <div className="search-bar">
        <span className="search-bar__icon">⌕</span>
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Estado: cargando */}
      {isLoading && (
        <p className="state-msg">Loading...</p>
      )}

      {/* Estado: error */}
      {error && (
        <p className="state-msg state-msg--error">{error}</p>
      )}

      {/* Estado: lista vacía */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <p>No {activeTab} yet.</p>
          <button className="btn btn--ghost" onClick={() => navigate("/add")}>
            Add your first {activeTab.slice(0, -1)}
          </button>
        </div>
      )}

      {/* Lista de contactos */}
      {!isLoading && filtered.length > 0 && (
        <div className="contact-grid">
          {filtered.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={() => navigate(`/edit/${activeTab}/${contact.id}`)}
              onDelete={() => setContactToDelete(contact)}
            />
          ))}
        </div>
      )}

      {/* Modal de confirmación de borrado */}
      {contactToDelete && (
        <div className="modal-overlay" onClick={() => setContactToDelete(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__icon">⚠</div>
            <h2 className="modal__title">Delete contact?</h2>
            <p className="modal__body">
              <strong>{contactToDelete.name}</strong> will be permanently removed.
            </p>
            <div className="modal__actions">
              <button className="btn btn--ghost" onClick={() => setContactToDelete(null)}>
                Cancel
              </button>
              <button className="btn btn--danger" onClick={handleDeleteConfirm}>
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}