import CompanyAccessClient from "@/components/CompanyAccessClient";

export default function AreaEmpresasPage() {
  return (
    <main className="container section">
      <div className="sectionTitle"><h2>Área de empresas</h2></div>
      <p className="smallMuted" style={{ marginBottom: 18 }}>
        Espacio para que las empresas accedan a su área privada una vez les hayáis creado el acceso manualmente a partir de su solicitud.
      </p>
      <CompanyAccessClient />
    </main>
  );
}
