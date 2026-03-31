import startups from "@/data/startups.json";

const propuestasDemo = [
  {
    nombre: "Ejemplo Startup",
    sector_normalizado: "—",
    sector_propuesto_libre: "observabilidad industrial",
    ubicacion: "Cataluña",
    estado: "Pendiente de revisión",
  },
  {
    nombre: "Demo Networks",
    sector_normalizado: "networking",
    sector_propuesto_libre: "—",
    ubicacion: "Comunidad de Madrid",
    estado: "Lista para publicar",
  },
];

export default function AdminPage() {
  return (
    <main className="container section">
      <div className="adminCard">
        <div className="sectionTitle">
          <h2>Panel de gestión</h2>
        </div>
        <p className="smallMuted">
          Esta maqueta separa el sector normalizado del sector libre propuesto para evitar duplicados y mantener limpios los filtros públicos.
        </p>

        <h3 style={{ marginTop: 28 }}>Propuestas recibidas</h3>
        <table className="adminTable">
          <thead>
            <tr>
              <th>Startup</th>
              <th>Sector normalizado</th>
              <th>Sector propuesto libre</th>
              <th>Ubicación</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {propuestasDemo.map((item) => (
              <tr key={`${item.nombre}-${item.ubicacion}`}>
                <td><strong>{item.nombre}</strong></td>
                <td>{item.sector_normalizado}</td>
                <td>{item.sector_propuesto_libre}</td>
                <td>{item.ubicacion}</td>
                <td>{item.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={{ marginTop: 32 }}>Directorio publicado</h3>
        <table className="adminTable">
          <thead>
            <tr>
              <th>Startup</th>
              <th>Sector</th>
              <th>Ubicación</th>
              <th>Web</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {startups.map((startup) => (
              <tr key={startup.slug}>
                <td>
                  <strong>{startup.nombre_empresa}</strong>
                  <br />
                  <span className="muted">{startup.descripcion_corta || "Sin descripción breve"}</span>
                </td>
                <td>{startup.sector_principal || "—"}</td>
                <td>{startup.ciudad || startup.comunidad_autonoma || "—"}</td>
                <td>{startup.web ? "Disponible" : "No disponible"}</td>
                <td>
                  <div className="actions">
                    <button type="button" className="buttonGhost">Editar</button>
                    <button type="button" className="buttonGhost">Publicar</button>
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
