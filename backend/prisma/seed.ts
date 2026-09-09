import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const ADMIN_EMAIL = "admin@utfpr.edu.br";
const ADMIN_PASSWORD = "admin123";

async function main() {
  const passwordHash = await hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "admin" },
    create: {
      name: "Administrador",
      email: ADMIN_EMAIL,
      password: passwordHash,
      course: "Universidade Tecnologica Federal do Paraná",
      campus: "Dois Vizinhos",
      avatarUrl:
        "https://gravatar.com/avatar/c9596e35deb1f5e6c1c45ca2e1537f05?s=400&d=robohash&r=x",
      bio: "Testando",
      isVerified: true,
      role: "admin",
    },
  });

  console.log(`Admin user ready: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
