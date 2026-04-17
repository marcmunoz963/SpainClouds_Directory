"use client";

import { useMemo, useState } from "react";
import startups from "@/data/startups.json";
import { buildMailto, saveClaim } from "@/lib/localDirectoryData";

const DESTINATION = "smartclouds@globaltech.tv";
const OPTIONS = [
  "Consulta general",
  "Proponer una startup",
  "Reclamar una empresa",
  "Solicitar cambios en una ficha",
  "Solicitar acceso para gestionar una ficha",
  "Promocionarse / featured listing",
  "Partnership / colaboración",
  "Reportar un error",
  "Sugerir una mejora",
];

export default function ContactUnifiedForm() {
  const [selectedSlug, setSelectedSlug] = useState("");
  const [selectedType, setSelectedType] = useState(OPTIONS[0]);
  const [status, setStatus] = useState("");

  const sorted = useMemo(
    () => [...startups].sort((a, b) => (a.nombre_empresa || "").localeCompare(b.nombre_empresa || "", "es")),
    []
  );

  const selected = sorted.find((item) => item.slug === selectedSlug);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      tipo: selectedType,
      startup_slug: selectedSlug,
      startup_nombre: selected?.nombre_empresa || formData.get("startup_manual"),
      nombre: formData.get("nombre"),
      email: formData.get("email"),
      empresa: formData.get("empresa"),
      cargo: formData.get("cargo"),
      mensaje: formData.get("mensaje"),
    };
    saveClaim(payload);
    window.dispatchEvent(new Event("spainclouds-data-updated"));

    const href = buildMailto({
      to: DESTINATION,
      subject: `Directorio Spainclouds - Contacto - ${selectedType}`,
      body: [
        `Tipo de solicitud: ${selectedType}`,
        `Startup afectada: ${payload.startup_nombre || ""}`,
        `Nombre: ${payload.nombre || ""}`,
        `Email: ${payload.email || ""}`,
        `Empresa: ${payload.empresa || ""}`,
        `Cargo: ${payload.cargo || ""}`,
        "",
        "Mensaje:",
        `${payload.mensaje || ""}`,
      ].join("\n"),
    });

    window.location.href = href;
    setStatus("Solicitud guardada y preparada para enviar por correo.");
  };

  return (
    <form className="formGrid" onSubmit={handleSubmit}>
      <div className="full">
        <label>Tipo de solicitud</label>
        <select className="select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          {OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>

      <div className="full">
        <label>Empresa del directorio</label>
        <select className="select" value={selectedSlug} onChange={(e) => setSelectedSlug(e.target.value)}>
          <option value="">Selecciona una empresa del directorio (si aplica)</option>
          {sorted.map((startup) => <option key={startup.slug} value={startup.slug}>{startup.nombre_empresa}</option>)}
        </select>
      </div>

      <div className="full">
        <label>Si no aparece, escribe el nombre</label>
        <input className="input" name="startup_manual" placeholder="Nombre de la empresa" />
      </div>

      <div><label>Nombre</label><input className="input" name="nombre" required /></div>
      <div><label>Email</label><input className="input" name="email" type="email" required /></div>
      <div><label>Empresa</label><input className="input" name="empresa" /></div>
      <div><label>Cargo</label><input className="input" name="cargo" /></div>

      <div className="full">
        <label>Mensaje</label>
        <textarea className="textarea" name="mensaje" placeholder="Cuéntanos qué necesitas." required />
      </div>

      <div className="full actions">
        <button className="button" type="submit">Enviar solicitud</button>
        {status ? <span className="notice">{status}</span> : null}
      </div>
    </form>
  );
}
