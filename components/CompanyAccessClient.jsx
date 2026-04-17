"use client";

import { useEffect, useState } from "react";
import { getClaims, getCompanySession, loginCompanyUser, logoutCompanyUser } from "@/lib/localDirectoryData";

export default function CompanyAccessClient() {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("");
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    setSession(getCompanySession());
    setClaims(getClaims());
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = loginCompanyUser(formData.get("login_email"), formData.get("login_password"));
    setStatus(result.ok ? "Sesión iniciada." : result.error);
    setSession(getCompanySession());
  };

  const handleLogout = () => {
    logoutCompanyUser();
    setSession(null);
    setStatus("Sesión cerrada.");
  };

  return (
    <div className="companyAccessGrid singleColumnAccess">
      <div className="formCard">
        <h2>Entrar</h2>
        <p className="smallMuted" style={{ marginBottom: 18 }}>
          Las cuentas de empresa las gestionáis vosotros manualmente a partir de la solicitud enviada por la empresa.
        </p>
        <form className="formGrid" onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input className="input" name="login_email" type="email" required />
          </div>
          <div>
            <label>Contraseña</label>
            <input className="input" name="login_password" type="password" required />
          </div>
          <div className="full actions">
            <button className="button" type="submit">Iniciar sesión</button>
          </div>
        </form>
      </div>

      {session ? (
        <div className="formCard">
          <h2>Sesión de empresa</h2>
          <p className="smallMuted">Has iniciado sesión como <strong>{session.company_name || session.email}</strong>.</p>
          <button className="buttonGhost" type="button" onClick={handleLogout}>Cerrar sesión</button>
          <div style={{ marginTop: 18 }}>
            <h3>Solicitudes registradas</h3>
            {claims.length ? (
              <ul className="plainList">
                {claims.map((claim) => <li key={claim.id}>{claim.startup_nombre} · {claim.email}</li>)}
              </ul>
            ) : (
              <p className="smallMuted">Todavía no hay solicitudes asociadas en este navegador.</p>
            )}
          </div>
          {status ? <div className="notice" style={{ marginTop: 16 }}>{status}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
