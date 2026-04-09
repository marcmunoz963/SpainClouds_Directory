"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createAdminSession, destroyAdminSession, verifyPassword } from "@/lib/auth";

function clean(value) {
  return String(value || "").trim();
}

export async function loginAction(formData) {
  const email = clean(formData.get("email")).toLowerCase();
  const password = clean(formData.get("password"));

  const admin = await prisma.adminUser.findUnique({ where: { email } });

  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    redirect("/login?error=1");
  }

  await createAdminSession(admin.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/login?logout=1");
}
