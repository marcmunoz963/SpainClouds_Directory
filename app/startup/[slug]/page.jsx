import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStartupBySlug } from "@/lib/startups";

export const dynamic = "force-dynamic";

function InfoBlock({ label, values }) {
  if (!values || !values.length) return null;
  return (
    <div className="infoBlock">
      <strong>{label}</strong>
      <div className="chipWrap">
        {values.map((value) => (
          <span className="chip" key={`${label}-${value}`}>{value}</span>
        ))}
      </div>
    </div>
  );
}

export default async function StartupPage({ params }) {
  const { slug } = await params;
  const startup = await getStartupBySlug(slug);
  if (!startup) notFound();

  const metaItems = [
    ["Sector principal", startup.sectorPrincipal],
    ["Comunidad autónoma", startup.comunidadAutonoma],
    ["Ciudad", startup.ciudad],
    ["Provincia", startup.provincia],
    ["Año de fundación", startup.anoFundacion],
    ["Modelo de negocio", startup.modeloNegocio],
    ["Vertical tecnológica", startup.verticalTecnologica],
  ].filter(([, value]) => value);

  return (
    <main className="container section">
      <div className="pageHeader">
        <Link className="backLink" href="/">← Volver al directorio</Link>
      </div>

      <div className="detailLayout">
        <section className="detailCard">
          <div className="startupHeader">
            <div className="logoWrap logoWrapLarge">
              <Image src={startup.logo || "/logos/alias-robotics.svg"} alt={`Logo de ${startup.nombreEmpresa}`} width={72} height={72} />
            </div>
            <div className="titleBlock">
              <div className="chipWrap">
                {startup.isSponsored ? <span className="chip chipAccent">{startup.sponsoredLabel || "Patrocinado"}</span> : null}
                {startup.isFeatured ? <span className="chip">Destacado</span> : null}
              </div>
              <h1>{startup.nombreEmpresa}</h1>
              <p className="muted">{startup.sectorPrincipal || "Sin sector"} · {startup.ciudad || startup.comunidadAutonoma || "España"}</p>
            </div>
          </div>

          <p className="lead">{startup.descripcionLarga || startup.descripcionCorta || "Sin descripción disponible."}</p>

          <div className="actions">
            <Link href={`/r/${startup.slug}`} className="button">{startup.ctaLabel || "Visitar web"}</Link>
            <Link href="/" className="buttonGhost">Seguir explorando</Link>
          </div>

          <div className="metaGrid">
            {metaItems.map(([label, value]) => (
              <div className="metaItem" key={label}>
                <strong>{label}</strong>
                <div>{value}</div>
              </div>
            ))}
          </div>
        </section>

        <aside className="detailCard">
          <h2 className="sectionHeading">Información adicional</h2>
          <InfoBlock label="Especialización" values={startup.subsectores} />
          <InfoBlock label="Tecnologías clave" values={startup.tecnologiasClave} />
          <InfoBlock label="Etiquetas" values={startup.tags} />
          <div className="infoBlock">
            <strong>Clicks de referral</strong>
            <div>{startup.clickCount}</div>
          </div>
        </aside>
      </div>
    </main>
  );
}
