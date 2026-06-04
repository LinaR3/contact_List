import React from "react";

// Colores para el avatar según la inicial del nombre
const COLORS = [
  { background: "#E6F1FB", color: "#185FA5" },
  { background: "#E1F5EE", color: "#0F6E56" },
  { background: "#FAEEDA", color: "#854F0B" },
  { background: "#FBEAF0", color: "#993556" },
  { background: "#EEEDFE", color: "#534AB7" },
];

function getColor(name = "") {
  return COLORS[name.charCodeAt(0) % COLORS.length];
}

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || "")
    .join("");
}

export default function ContactCard({ contact, onEdit, onDelete }) {
  const { name = "", email = "", phone = "", address = "" } = contact;

  return (
    <div className="contact-card">

      {/* Avatar con iniciales */}
      <div className="contact-card__avatar" style={getColor(name)}>
        {getInitials(name) || "?"}
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
        <button className="btn-icon btn-icon--edit"   onClick={() => onEdit(contact)}>✎</button>
        <button className="btn-icon btn-icon--delete" onClick={() => onDelete(contact)}>✕</button>
      </div>

    </div>
  );
}