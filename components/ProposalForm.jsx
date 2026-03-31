"use client";

import { useState } from "react";

const BASE_SECTORS = [
  "cloud",
  "networking",
  "ciberseguridad",
  "data / IA",
  "telco",
];

export default function ProposalForm() {
  const [sector, setSector] = useState("");
  const [customSector, setCustomSector] = useState("");

  const isOtherSelected = sector === "otro";

  return (
    <form className="formGrid" style={{ marginTop: 18 }}>
      <div>
        <label>Nombre de la startup</label>
        <input className="input" placeholder="Ej. Acme Cloud" />
      </div>

      <div>
        <label>Web</label>
        <input className="input" placeholder="https://..." />
      </div>

      <div>
        <label>Sector principal</label>
        <select className="select" value={sector} onChange={(e) => setSector(e.target.value)}>
          <option value="" disabled>
            Selecciona una opción
          </option>
          {BASE_SECTORS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          <option value="otro">Otro</option>
        </select>

        {isOtherSelected ? (
          <div style={{ marginTop: 12 }}>
            <label>Indica el sector</label>
            <input
              className="input"
              placeholder="Escribe el sector propuesto"
              value={customSector}
              onChange={(e) => setCustomSector(e.target.value)}
            />
          </div>
        ) : null}
      </div>

      <div>
        <label>Comunidad autónoma</label>
        <input className="input" placeholder="Cataluña" />
      </div>

      <div className="full">
        <label>Descripción corta</label>
        <textarea className="textarea" placeholder="Describe en una o dos frases qué hace la startup." />
      </div>

      <div>
        <label>Nombre de contacto</label>
        <input className="input" placeholder="Tu nombre" />
      </div>

      <div>
        <label>Email de contacto</label>
        <input className="input" placeholder="nombre@empresa.com" />
      </div>

      <div className="full">
        <label>Comentarios para el equipo editorial</label>
        <textarea
          className="textarea"
          placeholder="Información adicional, enlaces, contexto o motivo de la propuesta."
        />
      </div>

      <div className="full actions">
        <button type="button" className="button">
          Enviar propuesta
        </button>
        <span className="notice">
          Botón de demo. Aquí se conectaría el guardado real de la propuesta.
        </span>
      </div>
    </form>
  );
}
