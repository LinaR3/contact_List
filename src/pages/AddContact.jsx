import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { createContact, updateContact, getContacts } from "../actions";

const TABS = [
  { key: "clients",   label: "Client",   emoji: "👤" },
  { key: "employees", label: "Employee", emoji: "👷" },
  { key: "providers", label: "Provider", emoji: "🏢" },
];

const EMPTY_FORM = { name: "", email: "", phone: "", address: "" };

export default function AddContact() {
  const { store, dispatch } = useGlobalReducer();
  const { contacts } = store;
  const navigate = useNavigate();
  const { tab, id } = useParams();

  const isEditing = !!id;

  // Si viene de editar, usa el tab de la URL. Si es nuevo, empieza en clients
  const [selectedTab, setSelectedTab] = useState(tab || "clients");
  const [form, setForm]               = useState(EMPTY_FORM);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  // Si estamos editando, cargar los datos del contacto
  useEffect(() => {
    if (isEditing) {
      const existing = (contacts[tab] || []).find(
        c => String(c.id) === String(id)
      );
      if (existing) {
        setForm({
          name:    existing.name    || "",
          email:   existing.email   || "",
          phone:   existing.phone   || "",
          address: existing.address || "",
        });
        setSelectedTab(tab);
      } else {
        getContacts(dispatch, tab);
      }
    }
  }, [id, contacts]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) { setError("Name is required."); return; }
    if (!form.email.trim()) { setError("Email is required."); return; }

    setLoading(true);
    const ok = isEditing
      ? await updateContact(dispatch, tab, id, form)
      : await createContact(dispatch, selectedTab, form);
    setLoading(false);

    if (ok) navigate("/");
    else setError("Something went wrong. Please try again.");
  };

  return (
    <div className="add-contact-page">

      {/* Header */}
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h1 className="page-title">
          {isEditing ? "Edit contact" : "New contact"}
        </h1>
      </div>

      <div className="form-card">

        {/* Selector de tipo — solo visible al crear, no al editar */}
        {!isEditing && (
          <div className="form-type-selector">
            <p className="form-type-label">Contact type</p>
            <div className="form-type-buttons">
              {TABS.map(t => (
                <button
                  key={t.key}
                  className={`form-type-btn ${selectedTab === t.key ? "form-type-btn--active" : ""}`}
                  onClick={() => setSelectedTab(t.key)}
                  type="button"
                >
                  <span className="form-type-btn__emoji">{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Si estamos editando, mostrar badge del tipo */}
        {isEditing && (
          <div className="form-tab-indicator">
            Editing: <strong>{tab}</strong>
          </div>
        )}

        {error && <p className="form-error">{error}</p>}

        <div className="form-group">
          <label htmlFor="name">Full name *</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Maria González"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="e.g. maria@empresa.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="e.g. +57 300 000 0000"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="e.g. Calle 123, Bogotá"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button className="btn btn--ghost" onClick={() => navigate("/")} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn--primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Save changes" : `Add ${TABS.find(t => t.key === selectedTab)?.label}`}
          </button>
        </div>

      </div>
    </div>
  );
}