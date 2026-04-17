import AdminStartupEditClient from "@/components/AdminStartupEditClient";

export default async function AdminStartupEditPage({ params }) {
  const { slug } = await params;
  return <AdminStartupEditClient slug={slug} />;
}
