"use client";
import { useEffect, useMemo, useState } from "react";
import StartupCard from "@/components/StartupCard";

const FEATURED_BATCH_SIZE = 3;
const RESULTS_PER_PAGE = 24;

export default function DirectoryClient({ startups }) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("");
  const [comunidad, setComunidad] = useState("");
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const sectors = [...new Set(startups.map((item) => item.sector_principal).filter(Boolean))].sort();
  const comunidades = [...new Set(startups.map((item) => item.comunidad_autonoma).filter(Boolean))].sort();

  const featuredPool = useMemo(() => {
    const sorted = [...startups].sort((a, b) => (a.nombre_empresa || "").localeCompare(b.nombre_empresa || ""));
    return sorted;
  }, [startups]);

  useEffect(() => {
    if (featuredPool.length <= FEATURED_BATCH_SIZE) return;
    const interval = setInterval(() => {
      setFeaturedIndex((current) => (current + FEATURED_BATCH_SIZE) % featuredPool.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [featuredPool]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return startups.filter((item) => {
      const hayTexto =
        !q ||
        [
          item.nombre_empresa,
          item.descripcion_corta,
          item.descripcion_larga,
          item.sector_principal,
          item.subsectores,
          item.ciudad,
          item.comunidad_autonoma,
          item.tipo_telco,
          item.tipo_networking,
          item.tipo_cloud,
          item.tecnologias_clave,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);

      const haySector = !sector || item.sector_principal === sector;
      const hayComunidad = !comunidad || item.comunidad_autonoma === comunidad;

      return hayTexto && haySector && hayComunidad;
    });
  }, [startups, query, sector, comunidad]);

  const hasActiveFilters = Boolean(query.trim() || sector || comunidad);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, sector, comunidad]);

  const featuredStartups = useMemo(() => {
    if (!featuredPool.length) return [];
    return Array.from({ length: Math.min(FEATURED_BATCH_SIZE, featuredPool.length) }, (_, offset) => {
      return featuredPool[(featuredIndex + offset) % featuredPool.length];
    });
  }, [featuredPool, featuredIndex]);

  const totalPages = hasActiveFilters ? Math.max(Math.ceil(filtered.length / RESULTS_PER_PAGE), 1) : 1;
  const startIndex = hasActiveFilters ? (currentPage - 1) * RESULTS_PER_PAGE : 0;
  const endIndex = hasActiveFilters ? startIndex + RESULTS_PER_PAGE : RESULTS_PER_PAGE;
  const visibleResults = hasActiveFilters ? filtered.slice(startIndex, endIndex) : [];

  return (
    <>
      <div className="panel filters">
        <input
          className="input"
          placeholder="Buscar por nombre, sector, ciudad o tecnología"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="select" value={sector} onChange={(e) => setSector(e.target.value)}>
          <option value="">Todos los sectores</option>
          {sectors.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select className="select" value={comunidad} onChange={(e) => setComunidad(e.target.value)}>
          <option value="">Todas las comunidades</option>
          {comunidades.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {!hasActiveFilters ? (
        <>
          <div className="sectionTitle">
            <div>
              <h2>Startups destacadas</h2>
              <p className="smallMuted sectionLead">
                Una muestra dinámica del ecosistema para descubrir nuevas startups en cada visita.
              </p>
            </div>
          </div>

          <div className="grid">
            {featuredStartups.map((startup) => (
              <StartupCard key={`${startup.slug}-${featuredIndex}`} startup={startup} />
            ))}
          </div>
        </>
      ) : filtered.length ? (
        <>
          <div className="sectionTitle">
            <div>
              <h2>Resultados</h2>
              <p className="smallMuted sectionLead">
                {filtered.length} coincidencias encontradas.
              </p>
            </div>
            <div className="muted">Página {currentPage} de {totalPages}</div>
          </div>

          <div className="grid">
            {visibleResults.map((startup) => (
              <StartupCard key={startup.slug} startup={startup} />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="pagination">
              <button
                type="button"
                className="buttonGhost"
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <div className="smallMuted">
                Mostrando {startIndex + 1}-{Math.min(endIndex, filtered.length)} de {filtered.length}
              </div>
              <button
                type="button"
                className="button"
                onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="empty">
          No hay resultados con los filtros actuales. Prueba otra búsqueda o limpia algún filtro.
        </div>
      )}
    </>
  );
}
