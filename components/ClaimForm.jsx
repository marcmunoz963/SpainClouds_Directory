"use client";

import { useMemo, useState } from "react";
import { buildMailto, saveClaim } from "@/lib/localDirectoryData";

const DESTINATION = "directorio@spainclouds.com";

export default function ClaimForm({ startups }) {
  const [selectedSlug, setSelectedSlug] = useState("");
  const [status, setStatus] = useState("");

  const sorted = useMemo(() => [...startups].sort((a, b) => (a.nombre_empresa || "").localeCompare(b.nombre_empresa || "", "es")), [startups]);
  const selected = sorted.find((item) => item.slug === selectedSlug);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
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
      subject: `Solicitud para reclamar listing: ${payload.startup_nombre || "Sin empresa"}`,
      body: [
        `Startup a reclamar: ${payload.startup_nombre || ""}`,
        `Nombre: ${payload.nombre || ""}`,
        `Email: ${payload.email || ""}`,
        `Empresa: ${payload.empresa || ""}`,
        `Cargo: ${payload.cargo || ""}`,
        "",
        `${payload.mensaje || ""}`,
      ].join("\n"),
    });
    window.location.href = href;
    setStatus("Solicitud guardada y preparada para enviar por correo.");
  };

  return (
    <form className="formGrid" onSubmit={handleSubmit}>
      <div className="full">
        <label>Empresa del directorio</label>
        <select className="select" value={selectedSlug} onChange={(e) => setSelectedSlug(e.target.value)}>
          <option value="">Selecciona una empresa del directorio</option>
          {sorted.map((startup) => <option key={startup.slug} value={startup.slug}>{startup.nombre_empresa}</option>)}
        </select>
      </div>
      <div className="full">
        <label>Si no aparece, escribe el nombre</label>
        <input className="input" name="startup_manual" placeholder="Nombre de la empresa" />
      </div>
      <div><label>Nombre</label><input className="input" name="nombre" required /></div>
      <div><label>Email corporativo</label><input className="input" name="email" type="email" required /></div>
      <div><label>Empresa</label><input className="input" name="empresa" required /></div>
      <div><label>Cargo</label><input className="input" name="cargo" /></div>
      <div className="full"><label>Prueba de relación con la empresa</label><textarea className="textarea" name="mensaje" placeholder="Indica tu relación con la empresa, LinkedIn, dominio corporativo, etc." required /></div>
      <div className="full actions"><button className="button" type="submit">Enviar solicitud</button>{status ? <span className="notice">{status}</span> : null}</div>
    </form>
  );
}
