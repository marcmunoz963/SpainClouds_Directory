"use client";

import { useState } from "react";
import { buildMailto } from "@/lib/localDirectoryData";

const DESTINATION = "directorio@spainclouds.com";

export default function ContactForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const href = buildMailto({
      to: DESTINATION,
      subject: `Contacto directorio: ${formData.get("asunto") || "Consulta"}`,
      body: [
        `Nombre: ${formData.get("nombre") || ""}`,
        `Email: ${formData.get("email") || ""}`,
        `Empresa: ${formData.get("empresa") || ""}`,
        "",
        `${formData.get("mensaje") || ""}`,
      ].join("\n"),
    });
    window.location.href = href;
    setStatus(`Se abrirá tu cliente de correo para escribirnos a ${DESTINATION}.`);
  };

  return (
    <form className="formGrid" onSubmit={handleSubmit}>
      <div><label>Nombre</label><input className="input" name="nombre" required /></div>
      <div><label>Email</label><input className="input" name="email" type="email" required /></div>
      <div><label>Empresa</label><input className="input" name="empresa" /></div>
      <div><label>Asunto</label><input className="input" name="asunto" placeholder="Consulta sobre el directorio" /></div>
      <div className="full"><label>Mensaje</label><textarea className="textarea" name="mensaje" required /></div>
      <div className="full actions"><button className="button" type="submit">Contactar</button>{status ? <span className="notice">{status}</span> : null}</div>
    </form>
  );
}
