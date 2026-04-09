"use client";
import { useMemo, useState } from "react";
import StartupCard from "@/components/StartupCard";
const PAGE_SIZE = 24;
const toggleValue = (list, value) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
function applySort(items, sort) {
  const base = [...items];
  if (sort === "nombre") return base.sort((a, b) => (a.nombreEmpresa || "").localeCompare(b.nombreEmpresa || "", "es"));
  if (sort === "clicks") return base.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
  return base.sort((a, b) => {
    if (Number(b.isSponsored) !== Number(a.isSponsored)) return Number(b.isSponsored) - Number(a.isSponsored);
    if (Number(b.isFeatured) !== Number(a.isFeatured)) return Number(b.isFeatured) - Number(a.isFeatured);
    if ((b.priorityScore || 0) !== (a.priorityScore || 0)) return (b.priorityScore || 0) - (a.priorityScore || 0);
    return (a.nombreEmpresa || "").localeCompare(b.nombreEmpresa || "", "es");
  });
}
function FilterGroup({ title, items, selected, onToggle }) {
  if (!items?.length) return null;
  return <div className="filterGroup"><h3>{title}</h3><div className="filterOptions">{items.map((item) => { const label = item.label || item; const count = item.count ?? null; const checked = selected.includes(label); return <label key={label} className={`facetOption ${checked ? "isActive" : ""}`}><input type="checkbox" checked={checked} onChange={() => onToggle(label)} /><span>{label}</span>{count !== null ? <small>{count}</small> : null}</label>; })}</div></div>;
}
export default function DirectoryClient({ startups, facets }) {
  const [query, setQuery] = useState("");
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedCommunities, setSelectedCommunities] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [onlySponsored, setOnlySponsored] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sort, setSort] = useState("prioridad");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = startups.filter((item) => {
      const textMatch = !q || [item.nombreEmpresa, item.descripcionCorta, item.descripcionLarga, item.sectorPrincipal, item.comunidadAutonoma, item.ciudad, ...(item.specializations || [])].filter(Boolean).join(" ").toLowerCase().includes(q);
      const sectorMatch = !selectedSectors.length || selectedSectors.includes(item.sectorPrincipal);
      const communityMatch = !selectedCommunities.length || selectedCommunities.includes(item.comunidadAutonoma);
      const specializationMatch = !selectedSpecializations.length || selectedSpecializations.every((value) => (item.specializations || []).includes(value));
      const sponsorMatch = !onlySponsored || item.isSponsored;
      const featuredMatch = !onlyFeatured || item.isFeatured;
      return textMatch && sectorMatch && communityMatch && specializationMatch && sponsorMatch && featuredMatch;
    });
    return applySort(matches, sort);
  }, [startups, query, selectedSectors, selectedCommunities, selectedSpecializations, onlySponsored, onlyFeatured, sort]);
  const totalPages = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const featuredRail = applySort(startups.filter((item) => item.isFeatured || item.isSponsored), "prioridad").slice(0, 6);
  const resetFilters = () => { setQuery(""); setSelectedSectors([]); setSelectedCommunities([]); setSelectedSpecializations([]); setOnlySponsored(false); setOnlyFeatured(false); setSort("prioridad"); setPage(1); };
  return <div className="landscapeLayout"><aside className="facetSidebar panel"><div className="sidebarTop"><h2>Filtros</h2><button type="button" className="textButton" onClick={resetFilters}>Limpiar</button></div><div className="filterGroup"><h3>Búsqueda</h3><input className="input" placeholder="Buscar por empresa, ciudad o especialización" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></div><FilterGroup title="Sector" items={facets.sectors} selected={selectedSectors} onToggle={(value) => { setSelectedSectors((current) => toggleValue(current, value)); setPage(1); }} /><FilterGroup title="Comunidad autónoma" items={facets.communities} selected={selectedCommunities} onToggle={(value) => { setSelectedCommunities((current) => toggleValue(current, value)); setPage(1); }} /><FilterGroup title="Especialización" items={facets.specializations} selected={selectedSpecializations} onToggle={(value) => { setSelectedSpecializations((current) => toggleValue(current, value)); setPage(1); }} /><div className="filterGroup"><h3>Visibilidad comercial</h3><label className={`facetOption ${onlySponsored ? "isActive" : ""}`}><input type="checkbox" checked={onlySponsored} onChange={() => { setOnlySponsored((v) => !v); setPage(1); }} /><span>Solo patrocinados</span></label><label className={`facetOption ${onlyFeatured ? "isActive" : ""}`}><input type="checkbox" checked={onlyFeatured} onChange={() => { setOnlyFeatured((v) => !v); setPage(1); }} /><span>Solo destacados</span></label></div></aside><section className="resultsPane"><div className="sectionTitle"><div><span className="eyebrow">Listings</span><h2 className="sectionHeading">Destacados y listado completo</h2></div><div className="toolbar"><select className="select compactSelect" value={sort} onChange={(event) => setSort(event.target.value)}><option value="prioridad">Orden comercial</option><option value="nombre">Nombre</option><option value="clicks">Más clics</option></select></div></div>{featuredRail.length ? <div className="featuredStrip">{featuredRail.map((startup) => <div className="featuredPill" key={`featured-${startup.slug}`}><span>{startup.nombreEmpresa}</span><small>{startup.isSponsored ? "Patrocinado" : "Destacado"}</small></div>)}</div> : null}<div className="resultsSummary"><strong>{filtered.length}</strong><span>resultados</span></div><div className="grid">{visible.map((startup) => <StartupCard key={startup.slug} startup={startup} />)}</div>{filtered.length === 0 ? <div className="emptyState">No hay startups que encajen con los filtros actuales.</div> : null}{totalPages > 1 ? <div className="pagination"><button type="button" className="buttonGhost" disabled={page === 1} onClick={() => setPage((current) => Math.max(current - 1, 1))}>Anterior</button><div className="smallMuted">Página {page} de {totalPages}</div><button type="button" className="button" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(current + 1, totalPages))}>Siguiente</button></div> : null}</section></div>;
}
