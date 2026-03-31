import DirectoryClient from "@/components/DirectoryClient";
import startups from "@/data/startups.json";

export default function HomePage() {
  const sectores = new Set(startups.map((item) => item.sector_principal).filter(Boolean)).size;
  const comunidades = new Set(startups.map((item) => item.comunidad_autonoma).filter(Boolean)).size;

  return (
    <main>
      <section className="hero">
        <div className="container heroGrid">
          <div className="heroCard">
                        <h1>El directorio de startups cloud, telco y networking en España.</h1>
            <p>
              Descubre startups españolas con información objetiva, fichas individuales
              y una navegación pensada para explorar el ecosistema por sector, ubicación y especialización.
            </p>
            <div className="kpis">
              <div className="kpi"><strong>{startups.length}</strong><span>startups incluidas</span></div>
              <div className="kpi"><strong>{sectores}</strong><span>sectores distintos</span></div>
              <div className="kpi"><strong>{comunidades}</strong><span>comunidades autónomas</span></div>
            </div>
          </div>
          <div className="heroSide heroCard">
            <div><span className="badge">Qué incluye</span></div>
            <div className="smallMuted"><strong>Directorio público</strong><br />Buscador, filtros y tarjetas con datos objetivos.</div>
            <div className="smallMuted"><strong>Fichas individuales</strong><br />Página propia por startup con información ampliada.</div>
            <div className="smallMuted"><strong>Directorio escalable</strong><br />Una estructura preparada para crecer y seguir incorporando nuevas startups.</div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container"><DirectoryClient startups={startups} /></div>
      </section>
    </main>
  );
}
