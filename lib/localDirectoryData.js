export const STORAGE_KEYS = {
  overrides: "spainclouds_overrides_v1",
  customStartups: "spainclouds_custom_startups_v1",
  proposals: "spainclouds_proposals_v1",
  claims: "spainclouds_claims_v1",
  companyUsers: "spainclouds_company_users_v1",
  companySession: "spainclouds_company_session_v1",
};

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getStorageItem(key, fallback) {
  if (typeof window === "undefined") return fallback;
  return safeJsonParse(window.localStorage.getItem(key), fallback);
}

function setStorageItem(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function slugify(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function titleCase(text) {
  return String(text || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function splitList(value) {
  if (!value) return [];
  return String(value)
    .split(/[;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeStartupShape(item) {
  const referralClicks = Number(item.referral_clicks || item.referralClicks || 0);
  return {
    ...item,
    referral_clicks: Number.isFinite(referralClicks) ? referralClicks : 0,
    deleted: Boolean(item.deleted),
    featured: Boolean(item.featured),
    sponsored: Boolean(item.sponsored),
    claimable: item.claimable !== false,
  };
}

export function getMergedStartups(baseStartups) {
  const overrides = getStorageItem(STORAGE_KEYS.overrides, {});
  const customStartups = getStorageItem(STORAGE_KEYS.customStartups, []);

  const mergedBase = baseStartups.map((startup) =>
    normalizeStartupShape({
      ...startup,
      ...(overrides[startup.slug] || {}),
    })
  );

  const mergedCustom = customStartups.map((startup) =>
    normalizeStartupShape({
      ...startup,
      ...(overrides[startup.slug] || {}),
    })
  );

  return [...mergedBase, ...mergedCustom].filter((item) => !item.deleted);
}

export function getStartupBySlug(baseStartups, slug) {
  return getMergedStartups(baseStartups).find((item) => item.slug === slug) || null;
}

export function updateStartupOverride(slug, patch) {
  const overrides = getStorageItem(STORAGE_KEYS.overrides, {});
  overrides[slug] = {
    ...(overrides[slug] || {}),
    ...patch,
  };
  setStorageItem(STORAGE_KEYS.overrides, overrides);
  return overrides[slug];
}

export function deleteStartup(slug) {
  return updateStartupOverride(slug, { deleted: true });
}

export function incrementReferralClick(slug) {
  const overrides = getStorageItem(STORAGE_KEYS.overrides, {});
  const current = overrides[slug]?.referral_clicks || 0;
  overrides[slug] = { ...(overrides[slug] || {}), referral_clicks: current + 1 };
  setStorageItem(STORAGE_KEYS.overrides, overrides);
  return current + 1;
}

export function setReferralClicks(slug, value) {
  return updateStartupOverride(slug, { referral_clicks: Number(value) || 0 });
}

export function toggleStartupFlag(slug, field) {
  const overrides = getStorageItem(STORAGE_KEYS.overrides, {});
  const current = Boolean(overrides[slug]?.[field]);
  overrides[slug] = { ...(overrides[slug] || {}), [field]: !current };
  setStorageItem(STORAGE_KEYS.overrides, overrides);
  return !current;
}

export function saveProposal(proposal) {
  const proposals = getStorageItem(STORAGE_KEYS.proposals, []);
  const item = {
    id: Date.now(),
    created_at: new Date().toISOString(),
    status: "Pendiente de revisión",
    ...proposal,
  };
  proposals.unshift(item);
  setStorageItem(STORAGE_KEYS.proposals, proposals);
  return item;
}

export function getProposals() {
  return getStorageItem(STORAGE_KEYS.proposals, []);
}

export function removeProposal(id) {
  const proposals = getStorageItem(STORAGE_KEYS.proposals, []);
  const next = proposals.filter((item) => item.id !== id);
  setStorageItem(STORAGE_KEYS.proposals, next);
}

export function publishProposal(proposal) {
  const customStartups = getStorageItem(STORAGE_KEYS.customStartups, []);
  const slugBase = slugify(proposal.nombre_startup || proposal.nombre_empresa || proposal.nombre || `startup-${proposal.id}`) || `startup-${proposal.id}`;
  let slug = slugBase;
  let counter = 2;
  const usedSlugs = new Set(customStartups.map((item) => item.slug));
  while (usedSlugs.has(slug)) {
    slug = `${slugBase}-${counter++}`;
  }

  const startup = normalizeStartupShape({
    slug,
    nombre_empresa: proposal.nombre_startup || proposal.nombre_empresa || proposal.nombre || "Nueva startup",
    web: proposal.web || "",
    descripcion_corta: proposal.descripcion_corta || proposal.descripcion || "",
    descripcion_larga: proposal.descripcion_corta || proposal.descripcion || "",
    sector_principal: proposal.sector_principal || proposal.sector_propuesto_libre || "",
    comunidad_autonoma: proposal.comunidad_autonoma || "",
    ciudad: proposal.ciudad || "",
    provincia: proposal.provincia || "",
    subsectores: proposal.subsectores || "",
    tecnologias_clave: proposal.tecnologias_clave || "",
    logo: "/logos/alias-robotics.svg",
    claimable: true,
    referral_clicks: 0,
  });

  customStartups.unshift(startup);
  setStorageItem(STORAGE_KEYS.customStartups, customStartups);
  removeProposal(proposal.id);
  return startup;
}

export function saveClaim(claim) {
  const claims = getStorageItem(STORAGE_KEYS.claims, []);
  const item = {
    id: Date.now(),
    created_at: new Date().toISOString(),
    ...claim,
  };
  claims.unshift(item);
  setStorageItem(STORAGE_KEYS.claims, claims);
  return item;
}

export function getClaims() {
  return getStorageItem(STORAGE_KEYS.claims, []);
}

export function createCompanyUser(payload) {
  const users = getStorageItem(STORAGE_KEYS.companyUsers, []);
  const exists = users.some((item) => item.email.toLowerCase() === payload.email.toLowerCase());
  if (exists) {
    return { ok: false, error: "Ya existe una cuenta con ese email." };
  }
  const user = {
    id: Date.now(),
    created_at: new Date().toISOString(),
    provider: payload.provider || "email",
    ...payload,
  };
  users.push(user);
  setStorageItem(STORAGE_KEYS.companyUsers, users);
  setStorageItem(STORAGE_KEYS.companySession, { email: user.email, company_name: user.company_name, id: user.id });
  return { ok: true, user };
}

export function loginCompanyUser(email, password) {
  const users = getStorageItem(STORAGE_KEYS.companyUsers, []);
  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
  if (!user) return { ok: false, error: "Credenciales incorrectas." };
  setStorageItem(STORAGE_KEYS.companySession, { email: user.email, company_name: user.company_name, id: user.id });
  return { ok: true, user };
}

export function getCompanySession() {
  return getStorageItem(STORAGE_KEYS.companySession, null);
}

export function logoutCompanyUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEYS.companySession);
}

export function buildMailto({ to, subject, body }) {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${to}?${params.toString()}`;
}
