import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { getAllStartupsForAdmin, getProposals } from "@/lib/startups";
import { logoutAction } from "@/app/login/actions";
import {
  deleteProposalAction,
  movePriorityAction,
  publishProposalAction,
  toggleFeaturedAction,
  toggleSponsoredAction,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await requireAdmin();
  const startups = await getAllStartupsForAdmin();
  const proposals = await getProposals();

  return (
    <main className="container section">
      <div className="adminGridTop">
        <div className="adminCard">
          <span className="eyebrow">Backoffice</span>
          <h1 className="adminTitle">Panel de gestión</h1>
          <div className="smallMuted">Sesión: {admin.email}</div>
          <p className="smallMuted">
            Aquí llegan las propuestas nuevas. Desde este panel puedes revisarlas, publicarlas en el directorio,
            editar las fichas existentes, destacar listings y cambiar su prioridad.
          </p>
          <form action={logoutAction} className="actions" style={{ marginTop: 14 }}>
            <button className="buttonGhost" type="submit">Cerrar sesión</button>
          </form>
        </div>
        <div className="adminCard statsCard">
          <div className="statLine"><strong>{startups.length}</strong><span>startups en base de datos</span></div>
          <div className="statLine"><strong>{startups.filter((item) => item.isFeatured).length}</strong><span>destacadas</span></div>
          <div className="statLine"><strong>{startups.filter((item) => item.isSponsored).length}</strong><span>patrocinadas</span></div>
          <div className="statLine"><strong>{proposals.length}</strong><span>propuestas pendientes</span></div>
        </div>
      </div>

      <div className="adminCard">
        <div className="sectionTitle">
          <div>
            <span className="eyebrow">Propuestas</span>
            <h2 className="sectionHeading">Bandeja de revisión</h2>
          </div>
        </div>
        <p className="smallMuted adminHint">
          Flujo actual: la propuesta entra aquí, se revisa, y con “Publicar” se crea una nueva startup en el directorio.
          Después ya se puede terminar de ajustar desde la pantalla de edición.
        </p>

        <table className="adminTable">
          <thead>
            <tr>
              <th>Startup</th>
              <th>Sector</th>
              <th>Ubicación</th>
              <th>Contacto</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal) => (
              <tr key={proposal.id}>
                <td>
                  <strong>{proposal.nombreStartup}</strong>
                  <div className="muted">{proposal.descripcionCorta || "Sin descripción"}</div>
                </td>
                <td>{proposal.sectorPrincipal || proposal.sectorPropuestoLibre || "—"}</td>
                <td>{proposal.comunidadAutonoma || "—"}</td>
                <td>{proposal.nombreContacto || proposal.emailContacto || "—"}</td>
                <td>
                  <div className="actions">
                    <form action={publishProposalAction}>
                      <input type="hidden" name="id" value={proposal.id} />
                      <button className="button" type="submit">Publicar</button>
                    </form>
                    <form action={deleteProposalAction}>
                      <input type="hidden" name="id" value={proposal.id} />
                      <button className="buttonGhost" type="submit">Descartar</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="adminCard">
        <div className="sectionTitle">
          <div>
            <span className="eyebrow">Listings</span>
            <h2 className="sectionHeading">Directorio publicado</h2>
          </div>
        </div>
        <table className="adminTable">
          <thead>
            <tr>
              <th>Startup</th>
              <th>Ubicación</th>
              <th>Estado comercial</th>
              <th>Prioridad</th>
              <th>Clicks</th>
              <th>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {startups.map((startup) => (
              <tr key={startup.id}>
                <td>
                  <strong>{startup.nombreEmpresa}</strong>
                  <div className="muted">{startup.descripcionCorta || "Sin descripción breve"}</div>
                </td>
                <td>{startup.ciudad || startup.comunidadAutonoma || "—"}</td>
                <td>
                  <div className="chipWrap">
                    {startup.isFeatured ? <span className="chip">Destacado</span> : null}
                    {startup.isSponsored ? <span className="chip chipAccent">{startup.sponsoredLabel || "Patrocinado"}</span> : null}
                    {!startup.isPublished ? <span className="chip">Oculto</span> : null}
                  </div>
                </td>
                <td>{startup.priorityScore}</td>
                <td>{startup.clickCount}</td>
                <td>
                  <div className="actions">
                    <Link href={`/admin/startups/${startup.slug}`} className="buttonGhost">Editar</Link>
                    <form action={toggleFeaturedAction}>
                      <input type="hidden" name="id" value={startup.id} />
                      <button className="buttonGhost" type="submit">{startup.isFeatured ? "Quitar destacado" : "Destacar"}</button>
                    </form>
                    <form action={toggleSponsoredAction}>
                      <input type="hidden" name="id" value={startup.id} />
                      <button className="buttonGhost" type="submit">{startup.isSponsored ? "Quitar sponsor" : "Patrocinar"}</button>
                    </form>
                    <form action={movePriorityAction}>
                      <input type="hidden" name="id" value={startup.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button className="buttonGhost" type="submit">Subir</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
