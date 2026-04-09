import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";
import startups from "../data/startups.json" with { type: "json" };

const prisma = new PrismaClient();

function clean(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text.length ? text : null;
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const featuredSlugs = new Set([
  "alias-robotics",
  "kenmei",
  "cas-networks",
  "xecretia",
  "8layers",
  "fivecomm"
]);

async function main() {
  await prisma.proposal.deleteMany();
  await prisma.startup.deleteMany();
  await prisma.adminUser.deleteMany();

  let rank = 1;
  for (const item of startups) {
    const featured = featuredSlugs.has(item.slug);
    await prisma.startup.create({
      data: {
        slug: item.slug,
        nombreEmpresa: item.nombre_empresa,
        web: clean(item.web),
        linkedinEmpresa: clean(item.linkedin_empresa),
        descripcionCorta: clean(item.descripcion_corta),
        descripcionLarga: clean(item.descripcion_larga),
        anoFundacion: clean(item.ano_fundacion),
        estadoEmpresa: clean(item.estado_empresa),
        pais: clean(item.pais),
        comunidadAutonoma: clean(item.comunidad_autonoma),
        provincia: clean(item.provincia),
        ciudad: clean(item.ciudad),
        alcanceGeografico: clean(item.alcance_geografico),
        sectorPrincipal: clean(item.sector_principal),
        subsectores: clean(item.subsectores),
        verticalTecnologica: clean(item.vertical_tecnologica),
        modeloNegocio: clean(item.modelo_negocio),
        faseStartup: clean(item.fase_startup),
        empleadosEstimados: clean(item.empleados_estimados),
        rangoEmpleados: clean(item.rango_empleados),
        financiacionTotalEstimada: clean(item.financiacion_total_estimada),
        ultimaRonda: clean(item.ultima_ronda),
        fechaUltimaRonda: clean(item.fecha_ultima_ronda),
        inversoresDestacados: clean(item.inversores_destacados),
        clientesDestacados: clean(item.clientes_destacados),
        sociosDestacados: clean(item.socios_destacados),
        fundadores: clean(item.fundadores),
        nombreCeo: clean(item.nombre_ceo),
        nombreCto: clean(item.nombre_cto),
        tipoTelco: clean(item.tipo_telco),
        focoTelco: clean(item.foco_telco),
        tipoNetworking: clean(item.tipo_networking),
        capaNetworking: clean(item.capa_networking),
        tipoCloud: clean(item.tipo_cloud),
        cloudsSoportadas: clean(item.clouds_soportadas),
        tecnologiasClave: clean(item.tecnologias_clave),
        logo: clean(item.logo),
        isPublished: true,
        isFeatured: featured,
        featuredRank: featured ? rank++ : 0,
        isSponsored: false,
        priorityScore: featured ? 100 - rank : 0,
        ctaLabel: "Visitar web"
      }
    });
  }

  await prisma.proposal.create({
    data: {
      nombreStartup: "Demo FinOps Cloud",
      web: "https://example.com",
      sectorPrincipal: "cloud",
      comunidadAutonoma: "Cataluña",
      descripcionCorta: "Plataforma SaaS para optimización de costes cloud.",
      nombreContacto: "Equipo SpainClouds",
      emailContacto: "hola@example.com",
      comentarios: "Ejemplo de propuesta almacenada en base de datos."
    }
  });

  await prisma.adminUser.create({
    data: {
      email: process.env.ADMIN_EMAIL || "admin@spainclouds.local",
      name: "Administrador",
      passwordHash: hashPassword(process.env.ADMIN_PASSWORD || "cambia-esta-password")
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
