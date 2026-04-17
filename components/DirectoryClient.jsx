"use client";

import { useEffect, useMemo, useState } from "react";
import StartupCard from "@/components/StartupCard";
import { getMergedStartups, splitList } from "@/lib/localDirectoryData";

const RESULTS_PER_PAGE = 24;

function getSpecializations(item) {
  return [
    ...splitList(item.subsectores),
    ...splitList(item.tecnologias_clave),
  ];
}

function toggleValue(list, value) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function optionCounts(startups, selectedSectors, selectedCommunities, query) {
  const textMatcher = (item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;

    return [
      item.nombre_empresa,
      item.descripcion_corta,
      item.descripcion_larga,
      item.sector_principal,
      item.subsectores,
      item.tecnologias_clave,
      item.ciudad,
      item.comunidad_autonoma,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q);
  };

  const sectorBase = startups.filter((item) => {
    const communityMatch =
      !selectedCommunities.length ||
      selectedCommunities.includes(item.comunidad_autonoma);

    return textMatcher(item) && communityMatch;
  });

  const communityBase = startups.filter((item) => {
    const sectorMatch =
      !selectedSectors.length ||
      selectedSectors.includes(item.sector_principal);

    return textMatcher(item) && sectorMatch;
  });

  const specializationBase = startups.filter((item) => {
    const sectorMatch =
      !selectedSectors.length ||
      selectedSectors.includes(item.sector_principal);

    const communityMatch =
      !selectedCommunities.length ||
      selectedCommunities.includes(item.comunidad_autonoma);

    return textMatcher(item) && sectorMatch && communityMatch;
  });

  const sectors = [
    ...new Set(startups.map((item) => item.sector_principal).filter(Boolean)),
  ]
    .sort((a, b) => a.localeCompare(b, "es"))
    .map((label) => ({
      label,
      count: sectorBase.filter((item) => item.sector_principal === label).length,
    }));

  const communities = [
    ...new Set(startups.map((item) => item.comunidad_autonoma).filter(Boolean)),
  ]
    .sort((a, b) => a.localeCompare(b, "es"))
    .map((label) => ({
      label,
      count: communityBase.filter(
        (item) => item.comunidad_autonoma === label
      ).length,
    }));

  const specializationMap = new Map();

  specializationBase.forEach((item) => {
    getSpecializations(item).forEach((entry) => {
      specializationMap.set(entry, (specializationMap.get(entry) || 0) + 1);
    });
  });

  const specializations = [...specializationMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "es"))
    .map(([label, count]) => ({ label, count }));

  return { sectors, communities, specializations };
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
  defaultOpen = true,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="filterSection">
      <button
        type="button"
        className="filterSectionToggle"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{title}</span>
        <span className="filterSectionToggleIcon">{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen ? (
        <div className="filterList compactFilterList">
          {options.map((option) => (
            <label
              key={option.label}
              className="filterCheckRow compactFilterRow"
            >
              <span className="filterCheckLeft compactFilterLeft">
                <input
                  type="checkbox"
                  checked={selected.includes(option.label)}
                  onChange={() => onToggle(option.label)}
                />
                <span>{option.label}</span>
              </span>
              <span className="filterCount">{option.count}</span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function DirectoryClient({ startups: baseStartups }) {
  const [query, setQuery] = useState("");
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedCommunities, setSelectedCommunities] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startups, setStartups] = useState(baseStartups);

  useEffect(() => {
    const syncData = () => setStartups(getMergedStartups(baseStartups));

    syncData();
    window.addEventListener("storage", syncData);
    window.addEventListener("spainclouds-data-updated", syncData);

    return () => {
      window.removeEventListener("storage", syncData);
      window.removeEventListener("spainclouds-data-updated", syncData);
    };
  }, [baseStartups]);

  const counts = useMemo(
    () => optionCounts(startups, selectedSectors, selectedCommunities, query),
    [startups, selectedSectors, selectedCommunities, query]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return startups.filter((item) => {
      const textMatch =
        !q ||
        [
          item.nombre_empresa,
          item.descripcion_corta,
          item.descripcion_larga,
          item.sector_principal,
          item.subsectores,
          item.tecnologias_clave,
          item.ciudad,
          item.comunidad_autonoma,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);

      const sectorMatch =
        !selectedSectors.length ||
        selectedSectors.includes(item.sector_principal);

      const communityMatch =
        !selectedCommunities.length ||
        selectedCommunities.includes(item.comunidad_autonoma);

      const itemSpecs = getSpecializations(item);

      const specializationMatch =
        !selectedSpecializations.length ||
        selectedSpecializations.every((entry) => itemSpecs.includes(entry));

      return (
        textMatch &&
        sectorMatch &&
        communityMatch &&
        specializationMatch
      );
    });
  }, [
    startups,
    query,
    selectedSectors,
    selectedCommunities,
    selectedSpecializations,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedSectors, selectedCommunities, selectedSpecializations]);

  const totalPages = Math.max(Math.ceil(filtered.length / RESULTS_PER_PAGE), 1);
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const visibleResults = filtered.slice(startIndex, endIndex);

  const featured = startups
    .filter((item) => item.featured || item.sponsored)
    .slice(0, 3);

  const hasActiveFilters =
    Boolean(query) ||
    selectedSectors.length > 0 ||
    selectedCommunities.length > 0 ||
    selectedSpecializations.length > 0;

  return (
    <div className="landscapeWrap">
      <aside className="landscapeSidebar panel">
        <div className="filterSection">
          <h3>Búsqueda</h3>
          <input
            className="input"
            placeholder="Buscar por empresa, ciudad o especialización"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <FilterGroup
          title="Sector"
          options={counts.sectors}
          selected={selectedSectors}
          onToggle={(value) =>
            setSelectedSectors((current) => toggleValue(current, value))
          }
          defaultOpen={true}
        />

        <FilterGroup
          title="Comunidad autónoma"
          options={counts.communities}
          selected={selectedCommunities}
          onToggle={(value) =>
            setSelectedCommunities((current) => toggleValue(current, value))
          }
          defaultOpen={true}
        />

        <FilterGroup
          title="Especialización"
          options={counts.specializations}
          selected={selectedSpecializations}
          onToggle={(value) =>
            setSelectedSpecializations((current) => toggleValue(current, value))
          }
          defaultOpen={false}
        />
      </aside>

      <section className="landscapeResults">
        {!hasActiveFilters && featured.length ? (
          <>
            <div className="sectionTitle">
              <div>
                <h2>Startups destacadas</h2>
                <p className="smallMuted sectionLead">
                  Una selección destacada del ecosistema.
                </p>
              </div>
            </div>

            <div className="grid">
              {featured.map((startup) => (
                <StartupCard
                  key={`featured-${startup.slug}`}
                  startup={startup}
                />
              ))}
            </div>
          </>
        ) : null}

        <div
          className="sectionTitle"
          style={{ marginTop: featured.length ? 26 : 0 }}
        >
          <div>
            <h2>Listado completo</h2>
            <p className="smallMuted sectionLead">
              {filtered.length} coincidencias encontradas.
            </p>
          </div>
          <div className="muted">
            Página {currentPage} de {totalPages}
          </div>
        </div>

        {filtered.length ? (
          <>
            <div className="grid">
              {visibleResults.map((startup) => (
                <StartupCard key={startup.slug} startup={startup} />
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="pagination">
                <div className="paginationSide">
                  {currentPage > 1 ? (
                    <button
                      className="buttonGhost"
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) => Math.max(page - 1, 1))
                      }
                    >
                      Anterior
                    </button>
                  ) : (
                    <span />
                  )}
                </div>

                <div className="smallMuted">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, filtered.length)} de{" "}
                  {filtered.length}
                </div>

                <div className="paginationSide paginationSideRight">
                  {currentPage < totalPages ? (
                    <button
                      className="button"
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(page + 1, totalPages)
                        )
                      }
                    >
                      Siguiente
                    </button>
                  ) : (
                    <span />
                  )}
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="empty">
            No hay resultados con los filtros actuales. Prueba otra combinación.
          </div>
        )}
      </section>
    </div>
  );
}