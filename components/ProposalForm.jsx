"use client";
import { useState } from "react";
const BASE_SECTORS = ["cloud", "networking", "ciberseguridad", "data / IA", "telco", "finops"];
export default function ProposalForm({ action }) {
  const [sector, setSector] = useState("");
  const isOther = sector === "otro";
  return (
    <form action={action} className="formGrid" style={{ marginTop: 20 }}>
      <div><label>Nombre de la startup</label><input className="input" name="nombreStartup" placeholder="Ej. Acme Cloud" required /></div>
      <div><label>Web</label><input className="input" name="web" placeholder="https://..." /></div>
      <div><label>Sector principal</label><select className="select" name="sectorPrincipal" value={sector} onChange={(event) => setSector(event.target.value)} required><option value="" disabled>Selecciona una opción</option>{BASE_SECTORS.map((option) => <option key={option} value={option}>{option}</option>)}<option value="otro">Otro</option></select>{isOther ? <div style={{ marginTop: 12 }}><label>Indica el sector</label><input className="input" name="sectorPropuestoLibre" placeholder="Escribe el sector propuesto" required /></div> : null}</div>
      <div><label>Comunidad autónoma</label><input className="input" name="comunidadAutonoma" placeholder="Cataluña" /></div>
      <div className="full"><label>Descripción corta</label><textarea className="textarea" name="descripcionCorta" placeholder="Describe en una o dos frases qué hace la startup." /></div>
      <div><label>Nombre de contacto</label><input className="input" name="nombreContacto" placeholder="Tu nombre" /></div>
      <div><label>Email de contacto</label><input className="input" type="email" name="emailContacto" placeholder="nombre@empresa.com" /></div>
      <div className="full"><label>Comentarios para el equipo editorial</label><textarea className="textarea" name="comentarios" placeholder="Información adicional, enlaces, contexto o motivo de la propuesta." /></div>
      <div className="full actions"><button className="button" type="submit">Enviar propuesta</button></div>
    </form>
  );
}
