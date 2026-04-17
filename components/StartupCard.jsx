"use client";

import Image from "next/image";
import Link from "next/link";
import { incrementReferralClick } from "@/lib/localDirectoryData";

export default function StartupCard({ startup }) {
  const handleOutbound = () => {
    if (startup.web) {
      incrementReferralClick(startup.slug);
      window.dispatchEvent(new Event("spainclouds-data-updated"));
    }
  };

  return (
    <article className="startupCard">
      <div className="startupHeader">
        <div className="logoWrap">
          <Image src={startup.logo} alt={`Logo de ${startup.nombre_empresa}`} width={56} height={56} />
        </div>
        <div>
          <h3>{startup.nombre_empresa}</h3>
          <div className="muted">{startup.sector_principal || "Sin sector"} · {startup.ciudad || startup.comunidad_autonoma || "España"}</div>
        </div>
      </div>

      <p className="smallMuted">{startup.descripcion_corta || "Sin descripción breve."}</p>

      <div className="actions">
        <Link href={`/startup/${startup.slug}`} className="button">Ver ficha</Link>
        {startup.web ? (
          <a className="buttonGhost" href={startup.web} target="_blank" rel="noreferrer" onClick={handleOutbound}>
            Web
          </a>
        ) : (
          <span className="buttonGhost buttonDisabled" aria-disabled="true" title="Web no disponible">Web no disponible</span>
        )}
      </div>
    </article>
  );
}
