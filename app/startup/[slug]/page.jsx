import startups from "@/data/startups.json";
import StartupDetailClient from "@/components/StartupDetailClient";

export function generateStaticParams() {
  return startups.map((startup) => ({ slug: startup.slug }));
}

export default async function StartupPage({ params }) {
  const { slug } = await params;
  const startup = startups.find((item) => item.slug === slug) || { slug };
  return <StartupDetailClient startup={startup} allStartups={startups} />;
}
