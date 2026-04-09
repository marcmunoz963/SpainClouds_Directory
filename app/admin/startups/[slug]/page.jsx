import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { saveStartupAction } from "@/app/admin/actions";
import { getStartupBySlug } from "@/lib/startups";

export const dynamic = "force-dynamic";

export default async function AdminStartupPage({ params }) {
  await requireAdmin();
  const { slug } = await params;
  const startup = await getStartupBySlug(slug);
  if (!startup) notFound();

  return (
    <main className="container section">
      <div className="pageHeader"><Link className="backLink" href="/admin">← Volver al panel</Link></div>
      <div className="formCard">
        <div className="sectionTitle"><div><span className="eyebrow">Edición</span><h1 className="adminTitle">{startup.nombreEmpresa}</h1></div></div>
        <form action={saveStartupAction} className="formGrid">
          <input type="hidden" name="id" value={startup.id} />
          <div><label>Nombre</label><input className="input" name="nombreEmpresa" defaultValue={startup.nombreEmpresa} /></div>
          <div><label>Slug</label><input className="input" name="slug" defaultValue={startup.slug} /></div>
          <div><label>Web</label><input className="input" name="web" defaultValue={startup.web || ""} /></div>
          <div><label>Sector principal</label><input className="input" name="sectorPrincipal" defaultValue={startup.sectorPrincipal || ""} /></div>
          <div><label>Comunidad autónoma</label><input className="input" name="comunidadAutonoma" defaultValue={startup.comunidadAutonoma || ""} /></div>
          <div><label>Ciudad</label><input className="input" name="ciudad" defaultValue={startup.ciudad || ""} /></div>
          <div className="full"><label>Descripción breve</label><textarea className="textarea" name="descripcionCorta" defaultValue={startup.descripcionCorta || ""} /></div>
          <div className="full"><label>Descripción ampliada</label><textarea className="textarea" name="descripcionLarga" defaultValue={startup.descripcionLarga || ""} /></div>
          <div className="full"><label>Subsectores</label><input className="input" name="subsectores" defaultValue={(startup.subsectores || []).join('; ')} /></div>
          <div className="full"><label>Tecnologías clave</label><input className="input" name="tecnologiasClave" defaultValue={(startup.tecnologiasClave || []).join('; ')} /></div>
          <div><label>Referral URL</label><input className="input" name="referralUrl" defaultValue={startup.referralUrl || ""} /></div>
          <div><label>CTA</label><input className="input" name="ctaLabel" defaultValue={startup.ctaLabel || ""} /></div>
          <div><label>Etiqueta sponsor</label><input className="input" name="sponsoredLabel" defaultValue={startup.sponsoredLabel || ""} /></div>
          <div><label>Prioridad</label><input className="input" type="number" name="priorityScore" defaultValue={startup.priorityScore || 0} /></div>
          <div className="full toggleGrid"><label><input type="checkbox" name="isPublished" defaultChecked={startup.isPublished} /> Publicada</label><label><input type="checkbox" name="isFeatured" defaultChecked={startup.isFeatured} /> Destacada</label><label><input type="checkbox" name="isSponsored" defaultChecked={startup.isSponsored} /> Patrocinada</label></div>
          <div className="full"><label>Notas internas</label><textarea className="textarea" name="notesInternal" defaultValue="" /></div>
          <div className="full actions"><button className="button" type="submit">Guardar cambios</button><Link href={`/startup/${startup.slug}`} className="buttonGhost">Ver ficha pública</Link></div>
        </form>
      </div>
    </main>
  );
}
