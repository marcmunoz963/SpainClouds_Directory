"use client";

import { useState } from "react";
import { saveProposal } from "@/lib/localDirectoryData";

const BASE_SECTORS = ["cloud", "networking", "ciberseguridad", "data / IA", "telco"];

export default function ProposalForm() {
  const [sector, setSector] = useState("");
  const [customSector, setCustomSector] = useState("");
  const [message, setMessage] = useState("");
  const isOtherSelected = sector === "otro";

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    saveProposal({
      nombre_startup: formData.get("nombre_startup"),
      web: formData.get("web"),
      sector_principal: sector === "otro" ? "" : sector,
      sector_propuesto_libre: sector === "otro" ? customSector : "",
      comunidad_autonoma: formData.get("comunidad_autonoma"),
      descripcion_corta: formData.get("descripcion_corta"),
      nombre_contacto: formData.get("nombre_contacto"),
      email_contacto: formData.get("email_contacto"),
      comentarios: formData.get("comentarios"),
    });
    window.dispatchEvent(new Event("spainclouds-data-updated"));
    event.currentTarget.reset();
    setSector("");
    setCustomSector("");
    setMessage("Propuesta enviada correctamente.");
  };

  return (
    <form className="formGrid" style={{ marginTop: 18 }} onSubmit={handleSubmit}>
      <div>
        <label>Nombre de la startup</label>
        <input className="input" name="nombre_startup" placeholder="Ej. Acme Cloud" required />
      </div>

      <div>
        <label>Web</label>
        <input className="input" name="web" placeholder="https://..." />
      </div>

      <div>
        <label>Sector principal</label>
        <select className="select" value={sector} onChange={(e) => setSector(e.target.value)} required>
          <option value="" disabled>Selecciona una opción</option>
          {BASE_SECTORS.map((option) => <option key={option} value={option}>{option}</option>)}
          <option value="otro">Otro</option>
        </select>

        {isOtherSelected ? (
          <div style={{ marginTop: 12 }}>
            <label>Indica el sector</label>
            <input className="input" placeholder="Escribe el sector propuesto" value={customSector} onChange={(e) => setCustomSector(e.target.value)} required />
          </div>
        ) : null}
      </div>

      <div>
        <label>Comunidad autónoma</label>
        <input className="input" name="comunidad_autonoma" placeholder="Cataluña" />
      </div>

      <div className="full">
        <label>Descripción corta</label>
        <textarea className="textarea" name="descripcion_corta" placeholder="Describe en una o dos frases qué hace la startup." />
      </div>

      <div>
        <label>Nombre de contacto</label>
        <input className="input" name="nombre_contacto" placeholder="Tu nombre" />
      </div>

      <div>
        <label>Email de contacto</label>
        <input className="input" name="email_contacto" placeholder="nombre@empresa.com" />
      </div>

      <div className="full">
        <label>Comentarios para el equipo editorial</label>
        <textarea className="textarea" name="comentarios" placeholder="Información adicional, enlaces, contexto o motivo de la propuesta." />
      </div>

      <div className="full actions">
        <button type="submit" className="button">Enviar propuesta</button>
        {message ? <span className="notice">{message}</span> : null}
      </div>
    </form>
  );
}
