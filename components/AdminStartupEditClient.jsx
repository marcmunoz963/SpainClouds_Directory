"use client";

import Link from "next/link";
import { useState } from "react";
import startupsJson from "@/data/startups.json";
import { getStartupBySlug, updateStartupOverride } from "@/lib/localDirectoryData";

export default function AdminStartupEditClient({ slug }) {
  const startup = getStartupBySlug(startupsJson, slug);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(() => ({
    nombre_empresa: startup?.nombre_empresa || "",
    web: startup?.web || "",
    descripcion_corta: startup?.descripcion_corta || "",
    descripcion_larga: startup?.descripcion_larga || "",
    sector_principal: startup?.sector_principal || "",
    comunidad_autonoma: startup?.comunidad_autonoma || "",
    ciudad: startup?.ciudad || "",
    provincia: startup?.provincia || "",
    subsectores: startup?.subsectores || "",
    tecnologias_clave: startup?.tecnologias_clave || "",
    referral_clicks: startup?.referral_clicks || 0,
  }));

  if (!startup) {
    return (
      <main className="container section">
        <div className="empty">No se ha encontrado la startup.</div>
      </main>
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSave(event) {
    event.preventDefault();
    updateStartupOverride(slug, {
      ...form,
      referral_clicks: Number(form.referral_clicks) || 0,
    });
    window.dispatchEvent(new Event("spainclouds-data-updated"));
    setSaved(true);
  }

  return (
    <main className="container section">
      <div className="pageHeader">
        <Link className="backLink" href="/admin">← Volver al admin</Link>
      </div>

      <div className="formCard">
        <div className="sectionTitle">
          <div>
            <h2>Editar ficha</h2>
            <p className="smallMuted sectionLead">{startup.nombre_empresa}</p>
          </div>
        </div>

        {saved ? <div className="notice" style={{ marginBottom: 18 }}>Cambios guardados correctamente.</div> : null}

        <form className="formGrid" onSubmit={handleSave}>
          <div>
            <label>Nombre</label>
            <input className="input" name="nombre_empresa" value={form.nombre_empresa} onChange={handleChange} />
          </div>

          <div>
            <label>Web</label>
            <input className="input" name="web" value={form.web} onChange={handleChange} />
          </div>

          <div className="full">
            <label>Descripción corta</label>
            <textarea className="textarea" name="descripcion_corta" value={form.descripcion_corta} onChange={handleChange} />
          </div>

          <div className="full">
            <label>Descripción larga</label>
            <textarea className="textarea" name="descripcion_larga" value={form.descripcion_larga} onChange={handleChange} />
          </div>

          <div>
            <label>Sector principal</label>
            <input className="input" name="sector_principal" value={form.sector_principal} onChange={handleChange} />
          </div>

          <div>
            <label>Comunidad autónoma</label>
            <input className="input" name="comunidad_autonoma" value={form.comunidad_autonoma} onChange={handleChange} />
          </div>

          <div>
            <label>Ciudad</label>
            <input className="input" name="ciudad" value={form.ciudad} onChange={handleChange} />
          </div>

          <div>
            <label>Provincia</label>
            <input className="input" name="provincia" value={form.provincia} onChange={handleChange} />
          </div>

          <div className="full">
            <label>Subsectores</label>
            <input className="input" name="subsectores" value={form.subsectores} onChange={handleChange} />
          </div>

          <div className="full">
            <label>Tecnologías clave</label>
            <input className="input" name="tecnologias_clave" value={form.tecnologias_clave} onChange={handleChange} />
          </div>

          <div>
            <label>Clicks de referral</label>
            <input className="input" type="number" name="referral_clicks" value={form.referral_clicks} onChange={handleChange} />
          </div>

          <div className="full actions">
            <button type="submit" className="button">Guardar cambios</button>
            <Link href={`/startup/${slug}`} className="buttonGhost">Ver ficha</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
