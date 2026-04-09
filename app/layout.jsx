import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SpainClouds Directory",
  description: "Directorio de startups cloud, telco, networking y ciberseguridad con filtros avanzados y gestión editorial.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
