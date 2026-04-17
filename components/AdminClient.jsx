"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import startupsJson from "@/data/startups.json";
import {
  deleteStartup,
  getClaims,
  getMergedStartups,
  getProposals,
  publishProposal,
  setReferralClicks,
  toggleStartupFlag,
  updateStartupOverride,
} from "@/lib/localDirectoryData";

function textValue(value) {
  return value || "—";
}

export default function AdminClient() {
  const [startups, setStartups] = useState(startupsJson);
  const [proposals, setProposals] = useState([]);
  const [claims, setClaims] = useState([]);

  const sync = () => {
    setStartups(getMergedStartups(startupsJson));
    setProposals(getProposals());
    setClaims(getClaims());
  };

  useEffect(() => {
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("spainclouds-data-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("spainclouds-data-updated", sync);
    };
  }, []);

  const stats = useMemo(() => ({
    total: startups.length,
    featured: startups.filter((item) => item.featured).length,
    sponsored: startups.filter((item) => item.sponsored).length,
    claims: claims.length,
  }), [startups, claims.length]);

  const handlePublish = (proposal) => {
    publishProposal(proposal);
    window.dispatchEvent(new Event("spainclouds-data-updated"));
    sync();
  };

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <main className="container section">
      <div className="sectionTitle" style={{ marginBottom: 18 }}>
        <div>
          <h2>Panel de gestión</h2>
        </div>
        <button type="button" className="buttonGhost" onClick={handleLogout}>Cerrar sesión</button>
      </div>
      <div className="adminStatsGrid">
        <div className="adminCard"><strong>{stats.total}</strong><span>Startups activas</span></div>
        <div className="adminCard"><strong>{stats.featured}</strong><span>Destacadas</span></div>
        <div className="adminCard"><strong>{stats.sponsored}</strong><span>Promocionadas</span></div>
        <div className="adminCard"><strong>{stats.claims}</strong><span>Claims recibidos</span></div>
      </div>

      <div className="adminCard" style={{ marginTop: 22 }}>
        <div className="sectionTitle"><h2>Propuestas recibidas</h2></div>
        <table className="adminTable">
          <thead>
            <tr><th>Startup</th><th>Sector</th><th>Ubicación</th><th>Contacto</th><th>Acción</th></tr>
          </thead>
          <tbody>
            {proposals.length ? proposals.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.nombre_startup}</strong><br /><span className="muted">{item.descripcion_corta || "Sin descripción"}</span></td>
                <td>{textValue(item.sector_principal || item.sector_propuesto_libre)}</td>
                <td>{textValue(item.comunidad_autonoma)}</td>
                <td>{textValue(item.email_contacto || item.nombre_contacto)}</td>
                <td><button className="buttonGhost" type="button" onClick={() => handlePublish(item)}>Publicar</button></td>
              </tr>
            )) : <tr><td colSpan="5" className="muted">No hay propuestas.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="adminCard" style={{ marginTop: 22 }}>
        <div className="sectionTitle"><h2>Solicitudes recibidas desde contacto</h2></div>
        <table className="adminTable">
          <thead>
            <tr><th>Tipo</th><th>Empresa</th><th>Email</th><th>Solicitante</th><th>Detalle</th></tr>
          </thead>
          <tbody>
            {claims.length ? claims.map((item) => (
              <tr key={item.id}>
                <td>{textValue(item.tipo || "Solicitud")}</td>
                <td>{textValue(item.startup_nombre || item.empresa)}</td>
                <td>{textValue(item.email)}</td>
                <td>{textValue(item.nombre)}</td>
                <td>{textValue(item.mensaje)}</td>
              </tr>
            )) : <tr><td colSpan="5" className="muted">No hay solicitudes todavía.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="adminCard" style={{ marginTop: 22 }}>
        <div className="sectionTitle"><h2>Directorio publicado</h2></div>
        <table className="adminTable">
          <thead>
            <tr><th>Startup</th><th>Sector</th><th>Ubicación</th><th>Referral</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {startups.map((startup) => (
              <tr key={startup.slug}>
                <td><strong>{startup.nombre_empresa}</strong><br /><span className="muted">{startup.descripcion_corta || "Sin descripción breve"}</span></td>
                <td>{textValue(startup.sector_principal)}</td>
                <td>{textValue(startup.ciudad || startup.comunidad_autonoma)}</td>
                <td>
                  <input
                    className="input adminMiniInput"
                    type="number"
                    defaultValue={startup.referral_clicks || 0}
                    onBlur={(e) => {
                      setReferralClicks(startup.slug, e.target.value);
                      window.dispatchEvent(new Event("spainclouds-data-updated"));
                    }}
                  />
                </td>
                <td>
                  <div className="actions adminActionsWrap">
                    <Link href={`/admin/startups/${startup.slug}`} className="buttonGhost">Editar ficha</Link>
                    <button type="button" className="buttonGhost" onClick={() => { toggleStartupFlag(startup.slug, "featured"); window.dispatchEvent(new Event("spainclouds-data-updated")); sync(); }}>
                      {startup.featured ? "Quitar destacado" : "Destacar"}
                    </button>
                    <button type="button" className="buttonGhost" onClick={() => { toggleStartupFlag(startup.slug, "sponsored"); window.dispatchEvent(new Event("spainclouds-data-updated")); sync(); }}>
                      {startup.sponsored ? "Quitar promo" : "Promocionar"}
                    </button>
                    <button type="button" className="buttonGhost" onClick={() => { updateStartupOverride(startup.slug, { referral_clicks: 0 }); window.dispatchEvent(new Event("spainclouds-data-updated")); sync(); }}>
                      Reset clicks
                    </button>
                    <button type="button" className="buttonGhost dangerButton" onClick={() => { deleteStartup(startup.slug); window.dispatchEvent(new Event("spainclouds-data-updated")); sync(); }}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
