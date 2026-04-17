import ContactUnifiedForm from "@/components/ContactUnifiedForm";

export default function ContactoPage() {
  return (
    <main className="container section">
      <div className="formCard">
        <div className="sectionTitle"><h2>Contacto y solicitudes</h2></div>
        <p className="smallMuted">
          Usa este formulario para consultas generales, reclamar una empresa, solicitar cambios en una ficha,
          pedir acceso para gestionarla o consultar opciones promocionales.
        </p>
        <ContactUnifiedForm />
      </div>
    </main>
  );
}
