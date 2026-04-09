import DirectoryClient from "@/components/DirectoryClient";
import { buildFacets, getPublishedStartups } from "@/lib/startups";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const startups = await getPublishedStartups();
  const facets = buildFacets(startups);

  return (
    <main>
      <section className="hero">
        <div className="container heroGrid">
          <div className="heroCard">
            <span className="eyebrow">Directorio</span>
            <h1>Startups cloud, telco, networking y ciberseguridad en España.</h1>
            <p>
              Explora el ecosistema con filtros avanzados, fichas individuales y una capa de gestión preparada
              para editar contenidos, destacar listings y activar campañas comerciales.
            </p>
            <div className="kpis">
              <div className="kpi"><strong>{startups.length}</strong><span>startups publicadas</span></div>
              <div className="kpi"><strong>{facets.sectors.length}</strong><span>sectores</span></div>
              <div className="kpi"><strong>{facets.communities.length}</strong><span>comunidades</span></div>
            </div>
          </div>
          <div className="heroCard heroSide">
            <div className="featureBlurb">
              <strong>Filtros tipo landscape</strong>
              <span>Sector, comunidad, especialización, búsqueda libre y estado comercial.</span>
            </div>
            <div className="featureBlurb">
              <strong>Feature listings</strong>
              <span>Destacados, patrocinados, prioridad editorial y CTA de referral.</span>
            </div>
            <div className="featureBlurb">
              <strong>Gestión rápida</strong>
              <span>Backoffice con edición de fichas, propuestas y control de orden.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <DirectoryClient startups={startups} facets={facets} />
        </div>
      </section>
    </main>
  );
}
