import { loginAction } from "@/app/login/actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const hasError = params?.error === "1";
  const didLogout = params?.logout === "1";

  return (
    <main className="container section">
      <div className="loginWrap">
        <div className="formCard loginCard">
          <span className="eyebrow">Acceso restringido</span>
          <h1 className="adminTitle">Acceder al panel</h1>
          <p className="smallMuted">
            Esta pantalla protege solo el área de administración. El directorio público sigue siendo accesible sin login.
          </p>

          {hasError ? <div className="errorBox">Credenciales incorrectas.</div> : null}
          {didLogout ? <div className="successBox">Sesión cerrada.</div> : null}

          <form action={loginAction} className="formGrid singleColumn" style={{ marginTop: 20 }}>
            <div>
              <label>Email</label>
              <input className="input" type="email" name="email" placeholder="admin@spainclouds.local" required />
            </div>
            <div>
              <label>Contraseña</label>
              <input className="input" type="password" name="password" placeholder="••••••••" required />
            </div>
            <div className="actions">
              <button className="button" type="submit">Entrar</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
