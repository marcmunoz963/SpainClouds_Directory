"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getStartupBySlug, incrementReferralClick, splitList, titleCase } from "@/lib/localDirectoryData";

function InfoBlock({ label, values }) {
  if (!values?.length) return null;
  return (
    <div className="infoBlock">
      <strong>{label}</strong>
      <div className="infoTagList">
        {values.map((item) => (
          <span className="infoTag" key={`${label}-${item}`}>{titleCase(item)}</span>
        ))}
      </div>
    </div>
  );
}

export default function StartupDetailClient({ startup: initialStartup, allStartups }) {
  const [startup, setStartup] = useState(initialStartup || null);

  useEffect(() => {
    const sync = () => {
      const next = getStartupBySlug(allStartups, initialStartup?.slug);
      setStartup(next || initialStartup || null);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("spainclouds-data-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("spainclouds-data-updated", sync);
    };
  }, [allStartups, initialStartup.slug]);

  const specializations = useMemo(() => splitList(startup?.subsectores), [startup?.subsectores]);
  const technologies = useMemo(() => splitList(startup?.tecnologias_clave), [startup?.tecnologias_clave]);

  if (!startup) {
    return (
      <main className="container section">
        <div className="empty">No se ha encontrado esta startup en el directorio.</div>
      </main>
    );
  }

  const handleOutbound = () => {
    if (startup.web) {
      incrementReferralClick(startup.slug);
      window.dispatchEvent(new Event("spainclouds-data-updated"));
    }
  };

  const meta = [
    ["Sector principal", startup.sector_principal],
    ["Comunidad autónoma", startup.comunidad_autonoma],
    ["Provincia", startup.provincia],
    ["Ciudad", startup.ciudad],
    ["Modelo de negocio", startup.modelo_negocio],
    ["Vertical tecnológica", startup.vertical_tecnologica],
    ["Año de fundación", startup.ano_fundacion],
    ["Alcance geográfico", startup.alcance_geografico],
    ["Cloud", startup.tipo_cloud || startup.clouds_soportadas],
    ["Networking", startup.tipo_networking || startup.capa_networking],
    ["Telco", startup.tipo_telco || startup.foco_telco],
  ].filter(([, value]) => value);

  return (
    <main className="container">
      <div className="pageHeader">
        <Link className="backLink" href="/">← Volver al directorio</Link>
      </div>

      <div className="detailLayout">
        <section className="detailCard">
          <div className="startupHeader">
            <div className="logoWrap" style={{ width: 72, height: 72 }}>
              <Image src={startup.logo || "/logos/alias-robotics.svg"} alt={`Logo de ${startup.nombre_empresa || startup.slug}`} width={72} height={72} />
            </div>
            <div>
              <h1>{startup.nombre_empresa || startup.slug}</h1>
              <div className="muted">{startup.ciudad || startup.comunidad_autonoma || "España"} · {startup.pais || "España"}</div>
            </div>
          </div>

          <p className="smallMuted" style={{ marginTop: 18 }}>{startup.descripcion_corta || startup.descripcion_larga || "Sin descripción disponible."}</p>

          <div className="actions" style={{ marginTop: 20 }}>
            {startup.web ? (
              <a className="button" href={startup.web} target="_blank" rel="noreferrer" onClick={handleOutbound}>Visitar web</a>
            ) : (
              <span className="button buttonDisabled" aria-disabled="true" title="Web no disponible">Web no disponible</span>
            )}
          </div>

          <div className="metaGrid">
            {meta.map(([label, value]) => (
              <div className="metaItem" key={label}>
                <strong>{label}</strong>
                <div>{value}</div>
              </div>
            ))}
          </div>
        </section>

        <aside className="detailCard">
          <h2 style={{ marginTop: 0 }}>Información adicional</h2>
          <div className="infoStack smallMuted">
            <InfoBlock label="Especialización" values={specializations} />
            <InfoBlock label="Tecnologías clave" values={technologies} />
            {startup.fundadores ? <div className="infoBlock"><strong>Fundadores</strong><div>{titleCase(startup.fundadores)}</div></div> : null}
            {startup.nombre_ceo ? <div className="infoBlock"><strong>CEO</strong><div>{titleCase(startup.nombre_ceo)}</div></div> : null}
            {startup.nombre_cto ? <div className="infoBlock"><strong>CTO</strong><div>{titleCase(startup.nombre_cto)}</div></div> : null}
          </div>
        </aside>
      </div>
    </main>
  );
}
