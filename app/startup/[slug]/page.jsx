import Image from "next/image";
import Link from "next/link";
import startups from "@/data/startups.json";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return startups.map((startup) => ({ slug: startup.slug }));
}

function splitValues(value) {
  if (!value) return [];
  return value
    .split(/[;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function InfoBlock({ label, value, asTags = false }) {
  if (!value) return null;

  const values = asTags ? splitValues(value) : [];
  const renderAsTags = asTags && values.length > 0;

  return (
    <div className="infoBlock">
      <strong>{label}</strong>
      {renderAsTags ? (
        <div className="infoTagList">
          {values.map((item) => (
            <span className="infoTag" key={`${label}-${item}`}>{item}</span>
          ))}
        </div>
      ) : (
        <div>{value}</div>
      )}
    </div>
  );
}

export default async function StartupPage({ params }) {
  const { slug } = await params;
  const startup = startups.find((item) => item.slug === slug);
  if (!startup) notFound();

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
              <Image src={startup.logo} alt={`Logo de ${startup.nombre_empresa}`} width={72} height={72} />
            </div>
            <div>
              <h1>{startup.nombre_empresa}</h1>
              <div className="muted">{startup.ciudad || startup.comunidad_autonoma || "España"} · {startup.pais || "España"}</div>
            </div>
          </div>

          <p className="smallMuted" style={{ marginTop: 18 }}>
            {startup.descripcion_corta || startup.descripcion_larga || "Sin descripción disponible."}
          </p>

          <div className="actions" style={{ marginTop: 20 }}>
            {startup.web ? (
              <a className="button" href={startup.web} target="_blank" rel="noreferrer">
                Visitar web
              </a>
            ) : (
              <span className="button buttonDisabled" aria-disabled="true" title="Web no disponible">
                Web no disponible
              </span>
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
            <InfoBlock label="Especialización" value={startup.subsectores} asTags />
            <InfoBlock label="Tecnologías clave" value={startup.tecnologias_clave} asTags />
            <InfoBlock label="Fundadores" value={startup.fundadores} />
            <InfoBlock label="CEO" value={startup.nombre_ceo} />
            <InfoBlock label="CTO" value={startup.nombre_cto} />
          </div>
          {!startup.subsectores && !startup.tecnologias_clave && !startup.fundadores && !startup.nombre_ceo && !startup.nombre_cto ? (
            <p className="smallMuted">No hay más información pública disponible para esta startup por el momento.</p>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
