import Link from "next/link";
const links = [
  { href: "/", label: "Directorio" },
  { href: "/proponer", label: "Proponer una startup" },
];
export default function NavBar() {
  return (
    <div className="nav">
      <div className="container navInner">
        <Link href="/" className="brand">Spain<span>Clouds</span> Directory</Link>
        <div className="navLinks">{links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</div>
      </div>
    </div>
  );
}
