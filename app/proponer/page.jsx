import ProposalForm from "@/components/ProposalForm";
import { createProposalAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function ProponerPage({ searchParams }) {
  const params = await searchParams;
  const ok = params?.ok === "1";

  return (
    <main className="container section">
      <div className="formCard">
        <div className="sectionTitle"><div><span className="eyebrow">Alta de propuestas</span><h1 className="adminTitle">Proponer una startup</h1></div></div>
        <p className="smallMuted">Las propuestas se guardan en la base de datos para revisión editorial. Si el sector no encaja, puedes usar “Otro” y completar el campo libre.</p>
        {ok ? <div className="successBox">Propuesta enviada correctamente.</div> : null}
        <ProposalForm action={createProposalAction} />
      </div>
    </main>
  );
}
