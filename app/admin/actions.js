"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function toString(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text.length ? text : null;
}

function toBool(value) {
  return value === "on" || value === "true" || value === true;
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || `startup-${Date.now()}`;
}

export async function createProposalAction(formData) {
  await prisma.proposal.create({
    data: {
      nombreStartup: toString(formData.get("nombreStartup")) || "Startup sin nombre",
      web: toString(formData.get("web")),
      sectorPrincipal: toString(formData.get("sectorPrincipal")),
      sectorPropuestoLibre: toString(formData.get("sectorPropuestoLibre")),
      comunidadAutonoma: toString(formData.get("comunidadAutonoma")),
      descripcionCorta: toString(formData.get("descripcionCorta")),
      nombreContacto: toString(formData.get("nombreContacto")),
      emailContacto: toString(formData.get("emailContacto")),
      comentarios: toString(formData.get("comentarios")),
      estado: "Pendiente de revisión",
    }
  });

  revalidatePath("/admin");
  redirect("/proponer?ok=1");
}

export async function publishProposalAction(formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const proposal = await prisma.proposal.findUnique({ where: { id } });
  if (!proposal) return;

  const baseSlug = slugify(proposal.nombreStartup);
  let slug = baseSlug;
  let counter = 2;

  while (await prisma.startup.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  await prisma.startup.create({
    data: {
      slug,
      nombreEmpresa: proposal.nombreStartup,
      web: proposal.web,
      descripcionCorta: proposal.descripcionCorta,
      sectorPrincipal: proposal.sectorPrincipal === "otro" ? proposal.sectorPropuestoLibre : proposal.sectorPrincipal,
      comunidadAutonoma: proposal.comunidadAutonoma,
      isPublished: true,
      isFeatured: false,
      isSponsored: false,
      priorityScore: 0,
      ctaLabel: "Visitar web",
      notesInternal: proposal.comentarios,
      logo: "/logos/alias-robotics.svg"
    }
  });

  await prisma.proposal.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function toggleFeaturedAction(formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const startup = await prisma.startup.findUnique({ where: { id } });
  if (!startup) return;
  await prisma.startup.update({
    where: { id },
    data: { isFeatured: !startup.isFeatured, featuredRank: !startup.isFeatured ? 1 : 0 }
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function toggleSponsoredAction(formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const startup = await prisma.startup.findUnique({ where: { id } });
  if (!startup) return;
  await prisma.startup.update({
    where: { id },
    data: { isSponsored: !startup.isSponsored, sponsoredLabel: !startup.isSponsored ? "Featured listing" : null }
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function movePriorityAction(formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const direction = String(formData.get("direction"));
  const startup = await prisma.startup.findUnique({ where: { id } });
  if (!startup) return;
  await prisma.startup.update({
    where: { id },
    data: { priorityScore: (startup.priorityScore || 0) + (direction === "up" ? 10 : -10) }
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteProposalAction(formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.proposal.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function saveStartupAction(formData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.startup.update({
    where: { id },
    data: {
      nombreEmpresa: toString(formData.get("nombreEmpresa")) || "Startup sin nombre",
      slug: toString(formData.get("slug")) || `startup-${id}`,
      web: toString(formData.get("web")),
      descripcionCorta: toString(formData.get("descripcionCorta")),
      descripcionLarga: toString(formData.get("descripcionLarga")),
      sectorPrincipal: toString(formData.get("sectorPrincipal")),
      subsectores: toString(formData.get("subsectores")),
      tecnologiasClave: toString(formData.get("tecnologiasClave")),
      comunidadAutonoma: toString(formData.get("comunidadAutonoma")),
      ciudad: toString(formData.get("ciudad")),
      referralUrl: toString(formData.get("referralUrl")),
      ctaLabel: toString(formData.get("ctaLabel")),
      sponsoredLabel: toString(formData.get("sponsoredLabel")),
      priorityScore: Number(formData.get("priorityScore") || 0),
      isPublished: toBool(formData.get("isPublished")),
      isFeatured: toBool(formData.get("isFeatured")),
      isSponsored: toBool(formData.get("isSponsored")),
      notesInternal: toString(formData.get("notesInternal")),
    }
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}
