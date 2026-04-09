import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  const { slug } = await params;
  const startup = await prisma.startup.findUnique({ where: { slug } });

  if (!startup) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  await prisma.startup.update({
    where: { slug },
    data: { clickCount: { increment: 1 } },
  });

  return NextResponse.redirect(startup.referralUrl || startup.web || new URL("/", request.url));
}
