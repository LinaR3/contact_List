import React from "react";

const TYPE_AVATAR = {
  clients:   { emoji: "👤", background: "#E6F1FB", color: "#185FA5" },
  employees: { emoji: "👷", background: "#E1F5EE", color: "#0F6E56" },
  providers: { emoji: "🏢", background: "#FAEEDA", color: "#854F0B" },
};

export default function ContactCard({ contact, tab, onEdit, onDelete }) {
  const { name = "", email = "", phone = "", address = "" } = contact;
  const avatar = TYPE_AVATAR[tab] || TYPE_AVATAR.clients;

  return (
    <div className="contact-card">

      {/* Avatar por tipo */}
      <div
        className="contact-card__avatar"
        style={{ background: avatar.background, color: avatar.color }}
      >
        <span className="contact-card__emoji">{avatar.emoji}</span>
      </div>

      {/* Info del contacto */}
      <div className="contact-card__info">
        <p className="contact-card__name">{name || "No name"}</p>
        {email   && <p className="contact-card__detail">✉ {email}</p>}
        {phone   && <p className="contact-card__detail">✆ {phone}</p>}
        {address && <p className="contact-card__detail">⌖ {address}</p>}
      </div>

      {/* Botones editar / borrar */}
      <div className="contact-card__actions">
        <button
          className="btn-icon btn-icon--edit"
          onClick={() => onEdit(contact)}
          title="Edit"
        >
          ✏️
        </button>
        <button
          className="btn-icon btn-icon--delete"
          onClick={() => onDelete(contact)}
          title="Delete"
        >
          🗑️
        </button>
      </div>

    </div>
  );
}