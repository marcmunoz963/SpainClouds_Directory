"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(data.error || "No se pudo iniciar sesión.");
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <main className="container section">
      <div className="formCard authCard">
        <div className="sectionTitle">
          <div>
            <h2>Acceso administrador</h2>
            <p className="smallMuted sectionLead">Introduce tus credenciales para entrar en el panel.</p>
          </div>
        </div>

        {error ? <div className="errorNotice">{error}</div> : null}

        <form className="formGrid" onSubmit={handleSubmit}>
          <div className="full">
            <label>Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="full">
            <label>Contraseña</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="full actions">
            <button className="button" type="submit">Entrar</button>
          </div>
        </form>
      </div>
    </main>
  );
}
