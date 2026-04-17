import { Suspense } from "react";
import LoginClient from "@/components/LoginClient";

export default function LoginPage() {
  return (
    <main className="container section">
      <Suspense fallback={null}>
        <LoginClient />
      </Suspense>
    </main>
  );
}