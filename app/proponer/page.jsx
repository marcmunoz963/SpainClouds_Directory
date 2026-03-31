import ProposalForm from "@/components/ProposalForm";

export default function ProponerPage() {
  return (
    <main className="container section">
      <div className="formCard">
        <div className="sectionTitle">
          <h2>Proponer una startup</h2>
        </div>
        <p className="smallMuted">
          Puedes elegir uno de los sectores existentes o seleccionar “Otro” para enviar una propuesta con un sector libre.
          Ese valor queda pendiente de revisión editorial antes de incorporarse al directorio público.
        </p>
        <ProposalForm />
      </div>
    </main>
  );
}
