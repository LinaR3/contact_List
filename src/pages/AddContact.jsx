import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { createContact, updateContact, getContacts } from "../actions";

const TABS = [
  { key: "clients",   label: "Client" },
  { key: "employees", label: "Employee" },
  { key: "providers", label: "Provider" },
];

const EMPTY_FORM = { name: "", email: "", phone: "", address: "" };

export default function AddContact() {
  const { store, dispatch } = useGlobalReducer();
  const { contacts, activeTab } = store;
  const navigate = useNavigate();
  const { tab, id } = useParams(); // si viene de /edit/:tab/:id

  const isEditing = !!id; // true si estamos editando, false si estamos creando
  const currentTab = tab || activeTab;

  const [form, setForm]       = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // Si estamos editando, cargar los datos del contacto en el formulario
  useEffect(() => {
    if (isEditing) {
      // Buscar el contacto en el store
      const existing = (contacts[currentTab] || []).find(
        c => String(c.id) === String(id)
      );
      if (existing) {
        setForm({
          name:    existing.name    || "",
          email:   existing.email   || "",
          phone:   existing.phone   || "",
          address: existing.address || "",
        });
      } else {
        // Si no está en el store, traerlo de la API
        getContacts(dispatch, currentTab);
      }
    }
  }, [id, contacts]);

  // Actualiza el campo que cambió en el formulario
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Envía el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validación básica
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    setLoading(true);
    let ok;

    if (isEditing) {
      ok = await updateContact(dispatch, currentTab, id, form);
    } else {
      ok = await createContact(dispatch, currentTab, form);
    }

    setLoading(false);

    if (ok) {
      navigate("/"); // regresa a la lista si todo salió bien
    } else {
      setError("Something went wrong. Please try again.");
    }
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

      {/* Formulario */}
      <div className="form-card">

        {/* Indicador de en qué agenda se guarda */}
        <div className="form-tab-indicator">
          Saving to: <strong>{currentTab}</strong>
        </div>

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
          <button
            className="btn btn--ghost"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : isEditing ? "Save changes" : "Add contact"}
          </button>
        </div>

      </div>
    </div>
  );
}