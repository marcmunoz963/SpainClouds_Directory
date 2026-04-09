import Image from "next/image";
import Link from "next/link";

export default function StartupCard({ startup }) {
  return (
    <article className="startupCard">
      <div className="startupHeader">
        <div className="logoWrap"><Image src={startup.logo || "/logos/alias-robotics.svg"} alt={`Logo de ${startup.nombreEmpresa}`} width={56} height={56} /></div>
        <div className="titleBlock"><div className="chipWrap">{startup.isSponsored ? <span className="chip chipAccent">{startup.sponsoredLabel || "Featured listing"}</span> : null}{startup.isFeatured ? <span className="chip">Destacado</span> : null}</div><h3>{startup.nombreEmpresa}</h3><div className="muted">{startup.sectorPrincipal || "Sin sector"} · {startup.ciudad || startup.comunidadAutonoma || "España"}</div></div>
      </div>
      <p className="smallMuted">{startup.descripcionCorta || "Sin descripción breve."}</p>
      <div className="cardMeta">{(startup.specializations || []).slice(0, 3).map((item) => <span className="miniChip" key={item}>{item}</span>)}</div>
      <div className="actions"><Link href={`/startup/${startup.slug}`} className="button">Ver ficha</Link><a className="buttonGhost" href={`/r/${startup.slug}`}>{startup.referralUrl ? (startup.ctaLabel || "Referral") : "Web"}</a></div>
    </article>
  );
}
