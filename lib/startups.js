import { prisma } from "@/lib/prisma";

function splitValues(value) {
  if (!value) return [];
  return String(value)
    .split(/[;|,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function sortStartups(items) {
  return [...items].sort((a, b) => {
    if (Number(b.isSponsored) !== Number(a.isSponsored)) return Number(b.isSponsored) - Number(a.isSponsored);
    if (Number(b.isFeatured) !== Number(a.isFeatured)) return Number(b.isFeatured) - Number(a.isFeatured);
    if ((b.priorityScore || 0) !== (a.priorityScore || 0)) return (b.priorityScore || 0) - (a.priorityScore || 0);
    if ((a.featuredRank || 0) !== (b.featuredRank || 0)) return (a.featuredRank || 0) - (b.featuredRank || 0);
    return (a.nombreEmpresa || "").localeCompare(b.nombreEmpresa || "", "es");
  });
}

export function serializeStartup(item) {
  const specializations = unique([
    ...splitValues(item.subsectores),
    ...splitValues(item.tecnologiasClave),
    ...splitValues(item.tipoCloud),
    ...splitValues(item.cloudsSoportadas),
    ...splitValues(item.tipoNetworking),
    ...splitValues(item.capaNetworking),
    ...splitValues(item.tipoTelco),
    ...splitValues(item.focoTelco),
  ]);

  return {
    id: item.id,
    slug: item.slug,
    nombreEmpresa: item.nombreEmpresa,
    web: item.web,
    descripcionCorta: item.descripcionCorta,
    descripcionLarga: item.descripcionLarga,
    sectorPrincipal: item.sectorPrincipal,
    comunidadAutonoma: item.comunidadAutonoma,
    ciudad: item.ciudad,
    provincia: item.provincia,
    pais: item.pais,
    logo: item.logo,
    modeloNegocio: item.modeloNegocio,
    verticalTecnologica: item.verticalTecnologica,
    anoFundacion: item.anoFundacion,
    subsectores: splitValues(item.subsectores),
    tecnologiasClave: splitValues(item.tecnologiasClave),
    specializations,
    tags: unique([item.sectorPrincipal, item.comunidadAutonoma, ...specializations]).slice(0, 8),
    isFeatured: item.isFeatured,
    isSponsored: item.isSponsored,
    priorityScore: item.priorityScore || 0,
    sponsoredLabel: item.sponsoredLabel,
    referralUrl: item.referralUrl,
    ctaLabel: item.ctaLabel || "Visitar web",
    clickCount: item.clickCount || 0,
    featuredRank: item.featuredRank || 0,
    isPublished: item.isPublished,
  };
}

export async function getPublishedStartups() {
  const records = await prisma.startup.findMany({ where: { isPublished: true } });
  return sortStartups(records.map(serializeStartup));
}

export async function getAllStartupsForAdmin() {
  const records = await prisma.startup.findMany();
  return sortStartups(records.map(serializeStartup));
}

export async function getStartupBySlug(slug) {
  const record = await prisma.startup.findUnique({ where: { slug } });
  return record ? serializeStartup(record) : null;
}

export async function getProposals() {
  return prisma.proposal.findMany({ orderBy: { createdAt: "desc" } });
}

export function buildFacets(startups) {
  const sectorCounts = new Map();
  const comunidadCounts = new Map();
  const specializationCounts = new Map();

  for (const startup of startups) {
    if (startup.sectorPrincipal) sectorCounts.set(startup.sectorPrincipal, (sectorCounts.get(startup.sectorPrincipal) || 0) + 1);
    if (startup.comunidadAutonoma) comunidadCounts.set(startup.comunidadAutonoma, (comunidadCounts.get(startup.comunidadAutonoma) || 0) + 1);
    for (const item of startup.specializations || []) {
      specializationCounts.set(item, (specializationCounts.get(item) || 0) + 1);
    }
  }

  const mapToList = (map) =>
    [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], "es"))
      .map(([label, count]) => ({ label, count }));

  return {
    sectors: mapToList(sectorCounts),
    communities: mapToList(comunidadCounts),
    specializations: mapToList(specializationCounts).slice(0, 60),
  };
}
